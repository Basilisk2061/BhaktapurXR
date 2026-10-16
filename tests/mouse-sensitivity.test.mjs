import assert from 'node:assert/strict';import {test} from 'node:test';
import {playerConfig} from '../src/game/player/player-config.ts';
import {mouseSensitivitySetting,normalizeSensitivityPercent,readSensitivityPercent,readMouseSensitivity,setSensitivityPercent} from '../src/game/input/mouse-sensitivity.ts';
test('mouse sensitivity retains the exact gameplay default and persists/clamps a usable percentage',()=>{
 assert.equal(mouseSensitivitySetting.default,100);assert.equal(playerConfig.camera.sensitivity,.0025);assert.equal(readMouseSensitivity(),.0025);
 let saved=null;const storage={getItem:()=>saved,setItem:(_key,value)=>{saved=value;}};
 setSensitivityPercent(150,storage);assert.equal(saved,'150');assert.equal(readSensitivityPercent(storage),150);
 assert.equal(playerConfig.camera.sensitivity*readSensitivityPercent(storage)/100,.00375);
 assert.equal(normalizeSensitivityPercent(-10),25);assert.equal(normalizeSensitivityPercent(999),250);assert.equal(normalizeSensitivityPercent(NaN),100);
 saved='broken';assert.equal(readSensitivityPercent(storage),100);setSensitivityPercent(100,storage);assert.equal(saved,'100');assert.equal(readSensitivityPercent(storage),100);assert.equal(readMouseSensitivity(),.0025);
});
