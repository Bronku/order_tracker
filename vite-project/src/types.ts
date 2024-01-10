export type Cake = {
    id: string,
    name: string,
    price: number,
    description: string,
    hidden: boolean,
    quantity: number
}
export type Order = {
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
    cakes: Cake[]
}
export function new_order(){
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
        cakes : []
    }
}
export function get_price(order: Order){
    if (order.cakes==null)
        return 0
    let price = -1 * order.advance;
    for (const cake of order.cakes)
        price += cake.price * cake.quantity;
    return price;
}