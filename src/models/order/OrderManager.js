import Database from "../../io/Database";
import Order from "./Order";

class OrderManager {

   constructor() {
      this._orders = new Set();
      Database.load("orders", this);
   }

   load(data) {
      if(data == null) {
         return;
      }

      let removing = new Set([...this._orders.values()]);

      for(let order_data of data) {
         let order = this.getOrderById(order_data.id);

         if(order == null) {
            order = Order.load(order_data);
            this._orders.add(order);
         } else {
            order.update(order_data);
            removing.delete(order);
         }
      }

      for(let remove of removing.values()) {
         this.order.delete(remove);
      }
   }

   read() {
      let data = [];

      for(let order of this._orders.values()) {
         data.push(order.read());
      }

      return data;
   }

   save() {
      Database.write("orders", this.read());
   }

   getOrderById(order_id) {
      return this.getOrder(order => order.id === order_id);
   }

   getOrder(isTargetOrder = null) {
      return this.orders.filter(isTargetOrder)[0] || null;
   }

   get orders() {
      return [...this._orders.values()].reverse();
   }

   /**
   * @param {OrderStatus} status
   */
   getOrdersByStatus(status) {
      return this.orders.filter(order => order.status === status);
   }

   /**
   * @param {Order} order
   */
   addOrder(order) {
      this._orders.add(order);
      this.save();
   }

   removeOrder(order) {
      this._orders.delete(order);
      this.save();
   }
}

export default (new OrderManager());
