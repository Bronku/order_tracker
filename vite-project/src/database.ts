import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
//await pb.admins.authWithPassword('admin@admin.com', 'secretsecret');
await pb.collection('users').authWithPassword('user1@admin.com', 'secretsecret');

export default pb;

export async function getOrders(){
    pb.collection('orders').getFullList().then((orders)=>{
        return orders;
    });
};