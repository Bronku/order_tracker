import { Order, Cake } from "./types";
import PocketBase from 'pocketbase';



//getters
export async function get_orders(client: PocketBase){
    return(JSON.parse(JSON.stringify(
        await client.collection('cake_orders').getFullList())))
}

export async function get_cakes(client : PocketBase){
    const response = await client.collection('cakes').getFullList();
    let out: Cake[] = [];
    response.forEach((e)=>{
        out.push({
            id: e.id,
            name: e.name,
            price: e.price,
            description: e.description,
            hidden: e.hidden,
            quantity: 0
        });
    });
    return out;
}



//setters
export async function upload_order(client: PocketBase, order: Order){
    if (order.id == null)
        await client.collection('cake_orders').create(order);
    else
        await client.collection('cake_orders').update(order.id, order);
}

export async function remove_order(client: PocketBase, order: Order){
    if (order.id == null) 
        return;
    await client.collection('cake_orders').delete(order.id);
}