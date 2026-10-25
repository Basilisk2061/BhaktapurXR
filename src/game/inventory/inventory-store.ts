import {createStore} from 'zustand/vanilla';
import {BirdFoodSystem} from '../food/bird-food-system';
export const inventoryItems={birdFood:{label:'Bird Food',action:'throwGrain'}} as const;
export const inventorySlots:readonly (keyof typeof inventoryItems|null)[]=['birdFood',null,null,null,null];
export function createItemSession(){return {food:new BirdFoodSystem(),inventory:createStore<{selected:number;expanded:boolean;select:(slot:number)=>void;expand:(open:boolean)=>void}>(set=>({selected:0,expanded:false,select:selected=>{if(selected>=0&&selected<inventorySlots.length)set({selected});},expand:expanded=>set({expanded})}))};}
export type ItemSession=ReturnType<typeof createItemSession>;
