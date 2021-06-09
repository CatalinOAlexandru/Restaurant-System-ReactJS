import Database from "../../io/Database";

class Inventory {

   constructor() {
      this._items = new Map();
      Database.load("inventory", this);
   }

   load(data) {
      if(data == null) {
         return;
      }

      for(let {item_id, quantity} of data) {
         if(quantity === 0 || quantity == null) {
            this._items.delete(item_id);
         } else {
            this._items.set(item_id, quantity);
         }
      }
   }

   read() {
      let data = [];

      for(let [item, quantity] of this._items.entries()) {
         data.push({item_id: item.id, quantity});
      }

      return read;
   }

   save() {
      Database.write("inventory", this.read());
   }

   /**
    * @param {Item} item
   */
   getItemStock(item) {
      return this._items.get(item.id) || 0;
   }

   /**
    * @param {Item} item
    * @param {Integer} quantity
   */
   addItemStock(item, quantity = 1) {
      let current_quantity = this._items.get(item.id);

      if(current_quantity == null) {
         current_quantity = 0;
      }

      current_quantity += quantity;

      this._items.set(item.id, current_quantity);
   }

   /**
    * @param {Item} item
    * @param {Integer} quantity
   */
   hasItemStock(item, quantity = 1) {
      return this.getItemStock(item.id) >= quantity;
   }

   /**
    * @param {Item} item
    * @param {Integer} quantity
   */
   removeItemStock(item, quantity = null) {
      if(quantity == null) {
         this._items.delete(item.id);
         return;
      }

      let current_quantity = this._items.get(item.id);

      if(current_quantity < quantity || quantity <= 0) {
         throw new Error(`Quantity out of accepted range: ${quantity}`);
      }

      if(quantity === current_quantity) {
         this._items.delete(item.id);
      } else {
         this._items.set(item.id, current_quantity - quantity);
      }
   }
}

export default (new Inventory());
