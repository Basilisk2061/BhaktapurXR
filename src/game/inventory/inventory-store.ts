import {createStore} from 'zustand/vanilla';
import {BirdFoodSystem} from '../food/bird-food-system';
export const inventoryItems={birdFood:{label:'Bird Food',action:'throwGrain'}} as const;
export const inventorySlots:readonly (keyof typeof inventoryItems|null)[]=['birdFood',null,null,null,null];
interface InventoryState {selected:number;highlighted:number;expanded:boolean;select:(slot:number)=>void;highlight:(slot:number)=>void;open:()=>void;close:(commit:boolean)=>void}
const valid=(slot:number)=>Number.isInteger(slot)&&slot>=0&&slot<inventorySlots.length;
export function createItemSession(){return {food:new BirdFoodSystem(),inventory:createStore<InventoryState>(set=>({selected:0,highlighted:0,expanded:false,select:selected=>{if(valid(selected))set(state=>state.selected===selected?state:{selected});},highlight:highlighted=>{if(valid(highlighted))set(state=>state.highlighted===highlighted?state:{highlighted});},open:()=>set(state=>({expanded:true,highlighted:state.selected})),close:commit=>set(state=>({expanded:false,selected:commit?state.highlighted:state.selected}))}))};}
export type ItemSession=ReturnType<typeof createItemSession>;
