import Alpine from "alpinejs";
import "./style.css";
import {
	Order,
	SpecialOrder,
	new_special_order,
	Cake,
	get_price,
	new_order,
} from "./types.ts";
import {
	upload_special_order,
	remove_special_order,
	pb,
	get_orders,
	get_special_orders,
	upload_order,
	remove_order,
	get_cakes,
} from "./database.ts";

Alpine.data("main", () => ({
	page: "view",
	routes: [
		{ name: "Zamówienia ciast", path: "view", icon: "list-ul" },
		{ name: "Podsumowanie", path: "summary", icon: "list-check" },
		{ name: "Zamówienia tortów", path: "special_orders", icon: "cake" },
	],
	overlay: false,
	redirect(path: string) {
		this.page = path;
		this.current_order = new_order();
	},
	editing: false,
	date_picker: false,
	date: "",
	overlay_type: "order",

	orders: [] as Order[],
	special_orders: [] as SpecialOrder[],
	cakes: [] as Cake[],
	summary: [] as Cake[],
	current_order: {} as Order,
	current_special_order: {} as SpecialOrder,

	//view actions
	async update_orders() {
		this.cakes = await get_cakes(pb);
		this.summary = this.cakes;

		let filter = "";
		if (this.date !== "")
			filter = pb.filter("date = {:date}", { date: this.date });

		this.special_orders = await get_special_orders(pb, filter);
		this.orders = await get_orders(pb, filter);
		for (const order of this.orders) {
			if (order.cakes === null) continue;
			for (const cake of order.cakes)
				for (const element of this.summary)
					if (element.id === cake.id) element.quantity += +cake.quantity;
		}
	},
	async get_order_by_id(id: string) {
		const filter = pb.filter("id = {:id}", { id: id });
		const response = await get_orders(pb, filter);
		return JSON.parse(JSON.stringify(response[0]));
	},
	async get_special_order_by_id(id: string) {
		const filter = pb.filter("id = {:id}", { id: id });
		const response = await get_special_orders(pb, filter);
		return JSON.parse(JSON.stringify(response[0]));
	},

	//edition, creation
	add_cake(cake: Cake) {
		for (const element of this.current_order.cakes)
			if (element.id === cake.id) {
				element.quantity++;
				return;
			}
		cake.quantity = 1;
		this.current_order.cakes.push(cake);
	},
	remove_cake(cake: Cake) {
		if (this.current_order.cakes.some((e) => e.id === cake.id))
			this.current_order.cakes.splice(
				this.current_order.cakes.findIndex((e) => e.id === cake.id),
				1,
			);
	},
	update_price(_order: Order) {
		this.current_order.price = get_price(this.current_order);
	},
	clear_order() {
		this.current_order = new_order();
	},
	async save_order() {
		await upload_order(pb, JSON.parse(JSON.stringify(this.current_order)));
		await this.update_orders();
	},
	async save_special_order() {
		await upload_special_order(
			pb,
			JSON.parse(JSON.stringify(this.current_special_order)),
		);
		await this.update_orders();
	},
	async delete_order(order: Order) {
		await remove_order(pb, order);
		this.current_order = new_order();
		await this.update_orders();
		this.overlay = false;
	},
	async delete_special_order(order: SpecialOrder) {
		await remove_special_order(pb, order);
		this.current_special_order = new_special_order();
		await this.update_orders();
		this.overlay = false;
	},
	create_order() {
		this.current_order = new_order();
		this.current_special_order = new_special_order();
		this.overlay_type = this.page === "view" ? "order" : "special_order";
		this.overlay = true;
		this.editing = true;
	},
	remove_special_order() {
		for (const special_order of this.special_orders)
			if (special_order.id === this.current_order.field) {
				this.current_special_order = special_order;
				this.current_special_order.field = null;
				this.save_special_order();
			}
		this.current_order.field = null;
	},
	remove_order() {
		for (const order of this.orders)
			if (order.id === this.current_special_order.field) {
				this.current_order = order;
				this.current_order.field = null;
				this.save_order();
			}
		this.current_special_order.field = null;
	},
	link_special_order() {},

	//overlay actions
	hide_overlay() {
		this.overlay = false;
		this.editing = false;
	},
	open_overlay(order: Order) {
		this.overlay_type = "order";
		this.overlay = true;
		const tmp = JSON.parse(JSON.stringify(order));
		tmp.field = "";
		this.current_order = tmp;
	},
	open_special_overlay(order: SpecialOrder) {
		this.overlay_type = "special_order";
		this.overlay = true;
		const tmp = JSON.parse(JSON.stringify(order));
		tmp.field = "";
		this.current_special_order = tmp;
	},
	edit_order(_order: Order) {
		this.page = "edit";
		this.overlay = false;
	},
	get_price() {
		this.update_price(this.current_order);
		return this.current_order.price;
	},

	//auth actions
	user: "",
	password: "",
	async login() {
		await pb.authStore.clear();
		await pb.collection("users").authWithPassword(this.user, this.password);
		this.user = "";
		this.password = "";
		this.page = "view";
		this.update_orders();
	},
	async logout() {
		await pb.authStore.clear();
		this.page = "login";
	},

	async init() {
		pb.afterSend = (response, data) => {
			if (response.status === 401) this.page = "login";
			if (response.status === 400) alert("Niepoprawne dane");
			return data;
		};

		if (!window.localStorage.getItem("pocketbase_auth")) {
			this.page = "login";
			return;
		}
		this.current_special_order = new_special_order();
		this.current_order = new_order();
		this.update_orders();
	},
}));

Alpine.start();
