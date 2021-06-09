import Database from "../../io/Database";
import MenuOption from "./MenuOption";

class Menu {

   /**
    * @param {MenuOption[]} menu_options
    */
   constructor(menu_options = []) {
      this._menu_options = new Set(menu_options);
      Database.load("menu", this);
   }

   load(data) {
      if(data == null) {
         return;
      }

      let removing = new Set([...this._menu_options.values()]);

      for(let menu_option_data of data) {
         let item = this.getOptionById(menu_option_data.id);

         if(item == null) {
            item = MenuOption.load(menu_option_data);
            this._menu_options.add(item);
         } else {
            item.update(menu_option_data);
            removing.delete(item);
         }
      }

      for(let remove of removing.values()) {
         this._menu_options.delete(remove);
      }
   }

   read() {
      let data = [];

      for(let menu_option of this._menu_options.values()) {
         data.push(menu_option.read());
      }

      return data;
   }

   save() {
      Database.write("menu", this.read());
   }

   getOptionById(option_id) {
      return this.getOption(option => option.id === option_id);
   }

   getOption(isTargetOption = null) {
      return this.options.filter(isTargetOption)[0] || null;
   }

   get options() {
      return [...this._menu_options.values()];
   }

   addMenuOption(menu_option) {
      this._menu_options.add(menu_option);
      this.save();
   }

   removeMenuOption(menu_option) {
      this._menu_options.delete(menu_option);
      this.save();
   }
}

export default (new Menu());
