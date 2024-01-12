import Alpine from 'alpinejs';
import './style.css';
import {Order,SpecialOrder, new_special_order, Cake, get_price, new_order} from './types.ts';
import { upload_special_order,remove_special_order,pb, get_orders, get_special_orders, upload_order, remove_order, get_cakes} from './database.ts';



Alpine.data('main',()=>({   
    page: 'view',
    routes: [
        { name: 'Zamówienia ciast', path: 'view', icon: 'list-ul'},
        { name: 'Podsumowanie', path: 'summary', icon: 'list-check'},
        { name: 'Zamówienia tortów', path:'special_orders', icon:'cake'}
    ],
    overlay: false,
    redirect(path: string){
        this.page = path;
        this.current_order = new_order();
    },
    editing :false,
    date_picker: false,
    date: '',



    
    orders: [] as Order[],
    special_orders: [] as SpecialOrder[],
    cakes: [] as Cake[],
    summary: [] as Cake[],
    current_order: {} as Order,
    current_special_order: {} as SpecialOrder,

    
    //view actions
    async update_orders(){
        this.cakes = await get_cakes(pb);
        this.summary = this.cakes;

        let filter = '';
        if (this.date != '')
            filter = pb.filter ("date = {:date}", {date: this.date});
        
        this.special_orders = await get_special_orders(pb, filter);
        this.orders = await get_orders(pb, filter);
        for (const order of this.orders){
            if (order.cakes===null)
                continue;
            for (const cake of order.cakes)
                this.summary.find(e=>e.id == cake.id)!.quantity += +cake.quantity;
        }

    },

    
    //edition, creation
    add_cake(cake: Cake){
        if (this.current_order.cakes.some(e=>e.id == cake.id))
            this.current_order.cakes.find(e=>e.id == cake.id)!.quantity++;
        else {
            cake.quantity = 1;
            this.current_order.cakes.push(cake);
        }
    },
    remove_cake(cake: Cake){
        if (this.current_order.cakes.some(e=>e.id == cake.id))
            this.current_order.cakes.splice(this.current_order.cakes.findIndex(e=>e.id == cake.id),1);
    },
    update_price(_order: Order){
        this.current_order.price = get_price(this.current_order);
    },
    clear_order(){
        this.current_order = new_order();
    },
    async save_order(){
        await upload_order(pb,JSON.parse(JSON.stringify(this.current_order)));
        this.editing = false;
        await this.update_orders();
    },
    async save_special_order(){
        await upload_special_order(pb,JSON.parse(JSON.stringify(this.current_special_order)));
        this.editing = false;
        await this.update_orders();
    },
    async delete_order(order: Order){
        await remove_order(pb,order);
        this.current_order = new_order();
        await this.update_orders();
        this.overlay = false;
    },
    async delete_special_order(order: SpecialOrder){
        await remove_special_order(pb,order);
        this.current_special_order = new_special_order();
        await this.update_orders();
        this.overlay = false;
    },
    create_order(){
        this.current_order = new_order();
        this.current_special_order = new_special_order();
        this.overlay = true;
        this.editing = true;
    },



    //overlay actions
    hide_overlay(){
        this.overlay = false;
        this.editing = false;
    },
    open_overlay(order: Order){
        this.overlay = true;
        this.current_order = JSON.parse(JSON.stringify(order));
    },
    open_special_overlay(order: SpecialOrder){
        this.overlay = true;
        this.current_special_order = JSON.parse(JSON.stringify(order));
    },
    edit_order(_order: Order){
        this.page = 'edit';
        this.overlay = false;
    },
    get_price(){
        this.update_price(this.current_order);
        return this.current_order.price;
    },
    

    //auth actions
    user : '',
    password: '',
    async login(){
        await pb.authStore.clear();
        await pb.collection('users').authWithPassword(this.user,this.password);
        this.user = '';
        this.password = '';
        this.page = 'view';
        this.update_orders();
    },
    async logout(){
        await pb.authStore.clear();
        this.page = 'login';
    },



    async init(){        
        pb.afterSend = ( (response, data) => {
            if (response.status === 401)
                this.page = 'login';
            if (response.status === 400)
                alert('Niepoprawne dane');
            return data;
        });

        if (!window.localStorage.getItem('pocketbase_auth')){
            this.page = 'login';
            return
        }
        this.current_special_order = new_special_order();
        this.current_order = new_order();
        this.update_orders();
    }
}));

Alpine.start();