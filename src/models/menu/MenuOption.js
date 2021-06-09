import Snowflake from "../../io/Snowflake";
import Menu from "./Menu";
import MenuOptionItems from "./MenuOptionItems";
import ItemManager from "../item/ItemManager";

class MenuOption {

   static load({name, price, items, id}) {
      return new MenuOption(name, price, items, id);
   }

   static create(...data) {
      let option = new MenuOption(...data);
      Menu.addMenuOption(option);
      return option;
   }

   /**
    * An option available for customers to order from the {Menu}
    * @param {String} name Name visible in the menu
    * @param {Number} price Price visible in the menu
    * @param {Map<Item, Integer>} items Map of items and quantities
   */
   constructor(name, price, items = null, id = null) {
      this._id = id || Snowflake.generate();
      this._name = name;
      this._price = price;
      this._items = new MenuOptionItems(this, items);
   }

   get id() {
      return this._id;
   }

   get name() {
      return this._name;
   }

   set name(value) {
      this._name = value;
      this.save();
   }

   get price() {
      return this._price;
   }

   set price(value) {
      this._price = value;
      this.save();
   }

   read() {
      return {
         id    : this._id,
         name  : this._name,
         price : this._price,
         items : [...this._items.entries()]
      };
   }

   update({name, price, items}) {
      this._name  = name;
      this._price = price;
      this._items = new MenuOptionItems(this, items);
   }

   save() {
      Menu.save();
   }

   addItem(item, quantity = 1) {
      let current_quantity = this._items.get(item.id);

      if(current_quantity == null) {
         current_quantity = 0;
      }

      current_quantity += quantity;

      this._items.set(item.id, current_quantity);
   }

   removeItem(item, quantity = null) {
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

   get formatted_items() {
      let item_names = [];

      // Collect item names in array
      for(let item_id of this._items.keys()) {
         let item = ItemManager.getById(item_id);
         item_names.push(item.name);
      }

      // Sort in alphabetical order
      item_names = item_names.sort();

      // Format into string
      return item_names.join(", ");
   }

   get formatted_price() {
      return this.price.toFixed(2);
   }
}

export default MenuOption;
