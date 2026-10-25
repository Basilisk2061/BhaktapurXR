import {createStore} from 'zustand/vanilla';
import {BirdFoodSystem} from '../food/bird-food-system';
export type InventoryIcon='grain';
export const inventoryItems={birdFood:{label:'Bird Food',description:'Small grains used to attract nearby pigeons.',actionHint:'Click to throw',icon:'grain' satisfies InventoryIcon,action:'throwGrain'}} as const;
export const inventorySlots:readonly (keyof typeof inventoryItems|null)[]=['birdFood',null,null,null,null];
interface InventoryState {selected:number;highlighted:number;expanded:boolean;select:(slot:number)=>void;highlight:(slot:number)=>void;open:()=>void;close:(commit:boolean)=>void}
const valid=(slot:number)=>Number.isInteger(slot)&&slot>=0&&slot<inventorySlots.length;
export function createItemSession(){return {food:new BirdFoodSystem(),inventory:createStore<InventoryState>(set=>({selected:-1,highlighted:-1,expanded:false,select:selected=>{if(valid(selected))set(state=>state.selected===selected?state:{selected});},highlight:highlighted=>{if(highlighted===-1||valid(highlighted))set(state=>state.highlighted===highlighted?state:{highlighted});},open:()=>set({expanded:true,highlighted:-1}),close:commit=>set(state=>({expanded:false,highlighted:-1,selected:commit&&valid(state.highlighted)?state.highlighted:state.selected}))}))};}
export type ItemSession=ReturnType<typeof createItemSession>;
