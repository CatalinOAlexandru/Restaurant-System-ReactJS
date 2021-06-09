class MenuOptionItems extends Map {

   constructor(menu_option, values = []) {
      super(values);
      this.menu_option = menu_option;
   }

   set(key, value) {
      super.set(key, value);
      this.save();
   }

   delete(key) {
      super.delete(key);
      this.save();
   }

   clear() {
      super.clear();
      this.save();
   }

   save() {
      this.menu_option.save();
   }
}

export default MenuOptionItems;
