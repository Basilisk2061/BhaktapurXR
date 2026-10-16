"use client";
import {useSyncExternalStore} from 'react';
import {mouseSensitivitySetting,readSensitivityPercent,setSensitivityPercent,subscribeSensitivity} from '../game/input/mouse-sensitivity';
export function MouseSensitivitySettings(){
 const value=useSyncExternalStore(subscribeSensitivity,readSensitivityPercent,()=>mouseSensitivitySetting.default);
 return <section className="settings-controls" aria-labelledby="controls-title"><h2 id="controls-title">Controls</h2><div className="sensitivity-control"><label htmlFor="mouse-sensitivity" className="sensitivity-label">Mouse sensitivity<output htmlFor="mouse-sensitivity">{Math.round(value)}%</output></label><input id="mouse-sensitivity" type="range" min={mouseSensitivitySetting.min} max={mouseSensitivitySetting.max} step={5} value={value} onChange={event=>setSensitivityPercent(Number(event.target.value))} aria-valuetext={`${Math.round(value)} percent${value===100?', default':''}`} aria-describedby="sensitivity-description"/><div className="range-labels" aria-hidden="true"><span>Low</span><span>High</span></div><p id="sensitivity-description">Controls how quickly the camera responds to mouse movement.</p><button type="button" onClick={()=>setSensitivityPercent(mouseSensitivitySetting.default)}>Reset to default</button></div></section>;
}
