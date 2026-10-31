import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export type CartCurrency = "USD" | "BDT";
export interface CartItem { id:string; name:string; price:number; image:string; quantity:number; unit?:string; currency:CartCurrency; }
type CartState={items:CartItem[];addItem:(item:Omit<CartItem,"quantity"> & {quantity?:number})=>void;setQuantity:(id:string,quantity:number)=>void;removeItem:(id:string)=>void;clearCart:()=>void};
export const useCartStore=create<CartState>()(persist((set)=>({items:[],addItem:(item)=>set((state)=>{const index=state.items.findIndex((existing)=>existing.id===item.id);if(index<0)return {items:[...state.items,{...item,quantity:item.quantity??1}]};return {items:state.items.map((existing,i)=>i===index?{...existing,quantity:existing.quantity+(item.quantity??1)}:existing)};}),setQuantity:(id,quantity)=>set((state)=>({items:state.items.map((item)=>item.id===id?{...item,quantity:Math.max(1,quantity)}:item)})),removeItem:(id)=>set((state)=>({items:state.items.filter((item)=>item.id!==id)})),clearCart:()=>set({items:[]})}),{name:"groca-cart",storage:createJSONStorage(()=>localStorage),skipHydration:true}));
