import Snowflake from "../../io/Snowflake";
import OrderManager from "./OrderManager";
import OrderStatus from "./OrderStatus";
import Menu from "../menu/Menu";

class Order {

   static load({status_id, table_number, menu_options, id, timestamp}) {
      let status = OrderStatus.getById(status_id);
      return new Order(status, table_number, menu_options, id, timestamp);
   }

   static create(...data) {
      let order = new Order(...data);
      OrderManager.addOrder(order);
      return order;
   }

   /**
   * @param {OrderStatus} status
   * @param {Integer} table_number
   */
   constructor(
      status, table_number,
      menu_options = null, id = null, timestamp = null
   ) {
      this._id = id || Snowflake.generate();
      this._status = typeof status === "string" ? OrderStatus[status] : status;
      this._table_number = table_number;
      this._menu_options = new Map(menu_options || []);
      this.timestamp = timestamp || Date.now();
   }

   update({status_id, table_number, menu_options, id, timestamp}) {
      this._id = id;
      this._status = OrderStatus.getById(status_id);
      this._table_number = table_number;
      this._menu_options = new Map(menu_options);
      this.timestamp = timestamp;
   }

   read() {
      return {
         id           : this._id,
         status_id    : this._status.id,
         table_number : this._table_number,
         menu_options : [...this._menu_options.entries()],
         timestamp    : this.timestamp
      };
   }

   get id() {
      return this._id;
   }

   get status() {
      return this._status;
   }

   set status(value) {
      this._status = value;
      this.save();
   }

   get table_number() {
      return this._table_number;
   }

   set table_number(value) {
      this._table_number = value;
      this.save();
   }

   get menu_options() {
      return [...this._menu_options.entries()];
   }

   save() {
      OrderManager.save();
   }

   addMenuOption(menu_option, quantity = 1) {
      let current_quantity = this._menu_options.get(menu_option.id);

      if(current_quantity == null) {
         current_quantity = 0;
      }

      current_quantity += quantity;

      this._menu_options.set(menu_option.id, current_quantity);
      this.save();
   }

   removeMenuOption(menu_option, quantity = null) {
      if(quantity == null) {
         this._menu_options.delete(menu_option.id);
         return;
      }

      let current_quantity = this._menu_options.get(menu_option.id);

      if(current_quantity < quantity || quantity <= 0) {
         throw new Error(`Quantity out of accepted range: ${quantity}`);
      }

      if(quantity === current_quantity) {
         this._menu_options.delete(menu_option.id);
      } else {
         this._menu_options.set(menu_option.id, current_quantity - quantity);
      }

      this.save();
   }

   get price() {
      let price = 0;

      // Calculate total
      for(let [menu_option_id, quantity] of this._menu_options.entries()) {
         let menu_option = Menu.getOptionById(menu_option_id);
         if(menu_option == null) continue;
         price += menu_option.price * quantity;
      }

      // Floor to 2 decimal places
      price = Math.trunc(price * 100) / 100;

      return price;
   }

   get formatted_price() {
      return this.price.toFixed(2);
   }
}

export default Order;
