import Alpine from 'alpinejs';
import PocketBase from 'pocketbase';
import './style.css';
import {Order, Cake, get_price, new_order} from './types.ts';
import { get_orders, upload_order, remove_order, get_cakes} from './database.ts';
import { pbAdress } from './constants.ts';

let pb: PocketBase;

Alpine.data('main',()=>({   
    page: 'view',
    routes: [
        { name: 'Zamówienia ciast', path: 'view', icon: 'cake'},
        { name: 'Edycja zamówień', path: 'edit' , icon: 'edit'},
        { name: 'Podsumowanie', path: 'summary', icon: 'list-check'}
    ],
    overlay: false,
    
    orders: [] as Order[],
    cakes: [] as Cake[],
    summary: [] as Cake[],
    current_order: {} as Order,

    
    //view actions
    async update_orders(){
        this.cakes = await get_cakes(pb);
        this.summary = this.cakes;

        this.orders = await get_orders(pb);
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
        this.current_order = new_order();
        await this.update_orders();
    },
    async delete_order(order: Order){
        await remove_order(pb,order);
        this.current_order = new_order();
        await this.update_orders();
        this.overlay = false;
    },



    //overlay actions
    hide_overlay(){
        this.overlay = false;
        this.current_order = new_order();
    },
    open_overlay(order: Order){
        this.overlay = true;
        this.current_order = order;
    },
    edit_order(_order: Order){
        this.page = 'edit';
        this.overlay = false;
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
        //await pb.collection('users').authWithPassword('user1@admin.com', 'secretsecret')
        //await pb.collection('users').authWithPassword('Bronkuu','password');

        pb = new PocketBase(pbAdress);
        
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
    
        this.current_order = new_order();
        this.update_orders();
    }
}));

Alpine.start();