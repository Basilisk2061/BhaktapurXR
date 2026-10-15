"""Prepare local masters: energy-trimmed impacts and a crossfaded ambient loop.
Requires numpy/scipy for this offline import only. Never writes incoming/.
"""
from pathlib import Path
import hashlib
import json
import numpy as np
from scipy.io import wavfile
from scipy.signal import find_peaks, resample_poly

SOURCE = Path('incoming/audio')
OUTPUT = Path('public/assets/audio')
RATE = 24000
manifest = {'sampleRate': RATE, 'sources': {}, 'footsteps': {}}

def read(name):
    path = next(p for p in SOURCE.iterdir() if p.stem == name)
    rate, raw = wavfile.read(path)
    audio = raw.astype(np.float64) / (np.iinfo(raw.dtype).max + 1) if raw.dtype.kind == 'i' else raw.astype(np.float64)
    manifest['sources'][name] = {'file': str(path).replace('\\', '/'), 'seconds': len(audio)/rate, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}
    return rate, audio

def write(path, audio, rate):
    path.parent.mkdir(parents=True, exist_ok=True)
    audio = resample_poly(audio, RATE, rate)
    wavfile.write(path, RATE, np.round(np.clip(audio, -1, 1)*32767).astype(np.int16))

rate, audio = read('durbar_square_ambience')
# Tail-to-head overlap: output end joins the start of the original tail exactly.
overlap = round(rate*.25)
loop = audio[:-overlap].copy()
fade = np.linspace(0, 1, overlap)[:, None]
loop[:overlap] = audio[-overlap:]*(1-fade)+audio[:overlap]*fade
write(OUTPUT/'ambience/durbar-square.wav', loop, rate)
manifest['ambience'] = {'path': '/assets/audio/ambience/durbar-square.wav', 'seconds': len(loop)/rate, 'boundaryCrossfadeSeconds': .25}

for stem, surface in [('footsteps_brick_stone', 'brick-stone'), ('footsteps_wood', 'wood')]:
    rate, audio = read(stem)
    mono = audio.mean(axis=1) if audio.ndim > 1 else audio
    hop = round(rate*.005)
    env = np.array([np.sqrt(np.mean(mono[i:i+hop]**2)) for i in range(0, len(mono), hop)])
    peaks, _ = find_peaks(env, height=env.max()*.045, prominence=env.max()*.04, distance=80)
    clips = []
    for index, peak in enumerate(peaks):
        # Keep double transients within one impact; trim using local activity, not equal chunks.
        low = max(0, peak-36, (peaks[index-1]+peak)//2 if index else 0)
        high = min(len(env), peak+60, (peak+peaks[index+1])//2 if index+1 < len(peaks) else len(env))
        active = np.flatnonzero(env[low:high] > max(.0006, env[peak]*.025)) + low
        start = max(0, int((active[0]*.005-.025)*rate))
        end = min(len(mono), int((active[-1]*.005+.065)*rate))
        sample = mono[start:end].copy()
        fade = min(round(rate*.003), len(sample)//2)
        sample[:fade] *= np.linspace(0,1,fade)
        sample[-fade:] *= np.linspace(1,0,fade)
        name = f'step-{index+1:02}.wav'
        write(OUTPUT/'footsteps'/surface/name, sample, rate)
        clips.append({'path': f'/assets/audio/footsteps/{surface}/{name}', 'sourceStart': round(start/rate,4), 'sourceEnd': round(end/rate,4), 'peak': round(peak*.005,3)})
    manifest['footsteps'][surface] = clips
(OUTPUT/'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
print(json.dumps({'ambience':manifest['ambience'], 'impacts':{k:len(v) for k,v in manifest['footsteps'].items()}}, indent=2))
