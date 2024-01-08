import Alpine from 'alpinejs';
import PocketBase from 'pocketbase';

//ts, buiseness logic
type Cake = {
    id: string,
    name: string,
    price: number,
    description: string,
    hidden: boolean,
}
type Order = {
    id: string | null,
    name: string,
    surname: string,
    delivery: string, //'somonino' | 'kartuzy' | 'dostawa'
    address: string,
    phone: string,
    advance: number,
    price: number,
    date: string,
    additional_info: string,
    status: string, //'zamówione' | 'w trakcie' | 'gotowe' | 'dostarczone'
    contents: {cake: Cake, quantity: number}[]
}
function new_order(){
    return {
        id : null,
        name : '',
        surname : '',
        delivery : 'kartuzy',
        address : '',
        phone : '',
        advance : 0,
        date : '',
        additional_info : '',
        price : 0,
        status : 'zamówione',
        contents : []
    }
}
function get_price(order: Order){
    let price = 0;
    order.contents.forEach((e)=>{
        price += e.cake.price * e.quantity;
    });
    price -= order.advance;
    return price;
}

//pb 
const pb = new PocketBase('http://127.0.0.1:8090');
await pb.collection('users').authWithPassword('user1@admin.com', 'secretsecret');

async function get_orders(){
    const response = await pb.collection('cake_orders').getFullList();
    let out: Order[] = [];
    response.forEach((e)=>{
        out.push({
            id: e.id,
            name: e.name,
            surname: e.surname,
            delivery: e.delivery,
            address: e.address,
            phone: e.phone,
            advance: e.advance,
            price: e.price,
            date: e.date,
            additional_info: e.additional_info,
            status: e.status,
            contents: e.contents
        });
    });
    return out;
}
async function upload_order(order: Order){
    console.log(order);
    if (order.id == null){
        await pb.collection('cake_orders').create(order);
    } else {
        await pb.collection('cake_orders').update(order.id, order);
    };
    console.log("Order uploaded");
}
async function remove_order(order: Order){
    if (order.id == null) return;
    await pb.collection('cake_orders').delete(order.id);
    console.log("Order removed");
}
async function get_cakes(){
    const response = await pb.collection('cakes').getFullList({
        filter: 'hidden = false'
    });
    let out: Cake[] = [];
    response.forEach((e)=>{
        out.push({
            id: e.id,
            name: e.name,
            price: e.price,
            description: e.description,
            hidden: e.hidden
        });
    });
    return out;
}

//alpine
document.addEventListener('alpine:init', async () => {
    Alpine.data('main',()=>({
        page: 'view',
        routes: [
            { name: 'view', path: 'view' },
            { name: 'edit', path: 'edit' }
        ],
        
        orders: [] as Order[],
        cakes: [] as Cake[],
        current_order: {} as Order,
        current_oake: {} as Cake,


        //view actions
        edit_order(order: Order){
            this.current_order = order;
            this.page = 'edit';
        },

        
        //edition, creation
        add_cake(cake: Cake){
            if (this.current_order.contents.some(e=>e.cake.id == cake.id))
                this.current_order.contents.find(e=>e.cake.id == cake.id)!.quantity++;
            else 
                this.current_order.contents.push({cake: cake, quantity: 1});
        },
        remove_cake(cake: Cake){
            if (this.current_order.contents.some(e=>e.cake.id == cake.id)){
                this.current_order.contents.splice(this.current_order.contents.findIndex(e=>e.cake.id == cake.id),1);
            }
            console.log(this.current_order.contents);
        },
        update_price(_order: Order){
            this.current_order.price = get_price(this.current_order);
        },
        async save_order(){
            upload_order(JSON.parse(JSON.stringify(this.current_order)));
            this.current_order = new_order();
            this.orders = await get_orders();
        },
        clear_form(){
            this.current_order = new_order();
        },
        async delete_order(order: Order){
            await remove_order(order);
            this.orders = await get_orders();
        },
        

        //init
        async init(){
            this.current_order = new_order();
            this.orders = await get_orders();
            this.cakes = await get_cakes();
            console.log("Data initialised");
        }
    }));
    console.log("Alpine initialised");
});

Alpine.start();