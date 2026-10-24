"use client";
import {GraphicsQualitySettings} from './graphics-quality-settings';
import {MouseSensitivitySettings} from './mouse-sensitivity-settings';
import './game-settings.css';
export function GameSettings({touch=false}:{touch?:boolean}={}){
 return <div className="heritage-settings"><GraphicsQualitySettings/><MouseSensitivitySettings touch={touch}/></div>;
}
