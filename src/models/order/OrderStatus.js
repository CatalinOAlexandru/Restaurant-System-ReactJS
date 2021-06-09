class OrderStatus {

   static getById(order_status_id) {
      for(let order_status_key in OrderStatus) {
         let order_status = OrderStatus[order_status_key];

         if(!(order_status instanceof OrderStatus)) {
            continue;
         }

         if(order_status.id === order_status_id) {
            return order_status;
         }
      }

      return null;
   }

   constructor(id, name) {
      this.id = id;
      this.name = name;
   }
}

OrderStatus.PLACED   = new OrderStatus(1, "Placed");
OrderStatus.REJECTED = new OrderStatus(2, "Rejected");
OrderStatus.PREPARED = new OrderStatus(4, "Prepared");

export default OrderStatus;
