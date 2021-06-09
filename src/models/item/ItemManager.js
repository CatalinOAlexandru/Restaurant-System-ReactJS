import Database from "../../io/Database";
import Item from "./Item";

class ItemManager {

   constructor() {
      this._items = new Set();
      Database.load("items", this);
   }

   load(data) {
      if(data == null) {
         return;
      }

      let removing = new Set([...this._items.values()]);

      for(let item_data of data) {
         let item = this.getItemById(item_data.id);

         if(item == null) {
            item = Item.load(item_data);
            this._items.add(item);
         } else {
            item.update(item_data);
            removing.delete(item);
         }
      }

      for(let remove of removing.values()) {
         this._items.delete(remove);
      }
   }

   read() {
      let data = [];

      for(let item of this._items.values()) {
         data.push(item.read());
      }

      return data;
   }

   save() {
      Database.write("items", this.read());
   }

   addItem(item) {
      this._items.add(item);
      this.save();
   }

   getItemById(item_id) {
      return this.getItem(item => item.id === item_id);
   }

   getItem(isTargetItem = null) {
      return this.items.filter(isTargetItem)[0] || null;
   }

   get items() {
      return [...this._items.values()];
   }
}

export default (new ItemManager());
