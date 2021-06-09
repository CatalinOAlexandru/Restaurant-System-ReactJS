import Snowflake from "../../io/Snowflake";
import ItemManager from "./ItemManager";

class Item {

   static load(data) {
      return new Item(data.name, data.id);
   }

   static create(...data) {
      let item = new Item(...data);
      ItemManager.addItem(item);
      return item;
   }

   /**
    * Ingredient used as part of a {MenuOption}
    */
   constructor(name, id = null) {
      this._id = id || Snowflake.generate();
      this._name = name;
   }

   read() {
      return {
         id   : this._id,
         name : this._name
      };
   }

   update(data) {
      this._name = data.name;
   }

   save() {
      ItemManager.save();
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
}

export default Item;
