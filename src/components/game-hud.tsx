"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import type {PointerStatus} from "@/game/input/player-input";
export function GameHud({ready,pointerStatus}:{ready:boolean;pointerStatus:PointerStatus}){const [hintVisible,setHintVisible]=useState(true);useEffect(()=>{if(!ready)return;const timer=window.setTimeout(()=>setHintVisible(false),pointerStatus==="locked"?3500:12000);return()=>window.clearTimeout(timer);},[ready,pointerStatus]);if(!ready)return null;return <div className="game-hud">
 {pointerStatus!=="locked"&&<details className="game-menu"><summary>Menu</summary><nav aria-label="Game menu"><Link href="/">Return home</Link><p>Click the scene to resume.</p><p>WASD &middot; Move<br/>Mouse &middot; Look<br/>Shift &middot; Run<br/>Space &middot; Jump<br/>Esc &middot; Release mouse</p><a href="https://www.openstreetmap.org/copyright">Map data &copy; OpenStreetMap contributors</a></nav></details>}
 {hintVisible&&<p className="game-control-hint" role="status">{pointerStatus==="fallback"?"Drag to look":"Click to look"}<span>WASD &middot; Move &nbsp; Shift &middot; Run &nbsp; Space &middot; Jump &nbsp; Esc &middot; Release</span></p>}
 </div>;}
