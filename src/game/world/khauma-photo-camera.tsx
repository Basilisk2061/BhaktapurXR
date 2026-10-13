import {useFrame} from "@react-three/fiber";
import type {RefObject} from "react";
import {PerspectiveCamera} from "three";
import type {PlayerInput} from "../input/player-input";
import {khaumaPhotoCamera} from "./khauma-axis-review";
/** Fixed diagnostic pose until controls are engaged; normal camera/controller untouched. */
export function KhaumaPhotoCamera({review,input}:{review:string|null;input:RefObject<PlayerInput>}) {
 const pose=process.env.NODE_ENV==="development"?khaumaPhotoCamera(review):null;
 useFrame(({camera})=>{
  if(!pose)return;
  if(input.current.active){if(camera instanceof PerspectiveCamera&&camera.fov!==55){camera.fov=55;camera.updateProjectionMatrix();}return;}
  camera.position.fromArray(pose.position);
  camera.lookAt(pose.position[0]-Math.sin(pose.yaw)*10,pose.height+Math.tan(pose.pitch)*10,pose.position[2]-Math.cos(pose.yaw)*10);
  if(camera instanceof PerspectiveCamera&&camera.fov!==pose.fov){camera.fov=pose.fov;camera.updateProjectionMatrix();}
 },-5);
 return null;
}
