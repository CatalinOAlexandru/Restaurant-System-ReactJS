if(!window.localStorage) {
   let data = {};

   window.localStorage = {
      getItem(key) {
         return data[key];
      },
      setItem(key, value) {
         data[key] = value;
      },
      removeItem(key) {
         delete data[key];
      }
   };

   console.log(`localStorage not defined- using a non persistent mock`);
}

class Database {

   constructor() {
      this._tracking = new Map();
      window.onvisibilitychange = window.onstorage = this._track.bind(this);
   }

   _track() {
      let is_different = false;

      for(let [key, target] of this._tracking.entries()) {
         let new_data = window.localStorage.getItem(key);
         let old_data = JSON.stringify(target.read());

         if(old_data == null || new_data === old_data) {
            continue;
         }

         is_different = true;
         target.load(JSON.parse(new_data));
      }

      if(is_different) {
         window.context.update();
      }
   }

   async load(key, target) {
      let data = await this.read(key);
      target.load(data || []);
      this._tracking.set(key, target);
      window.context.update();
   }

   async read(key) {
      let serialised_value = window.localStorage.getItem(key);

      if(serialised_value == null) {
         return null;
      }

      return JSON.parse(serialised_value);
   }

   async write(key, value = null) {
      if(value == null) {
         return this.delete(key);
      }

      let serialised_value = JSON.stringify(value);

      window.localStorage.setItem(key, serialised_value);
   }

   async delete(key) {
      window.localStorage.removeItem(key);
   }
}

let database = (new Database());
window.database = database; // TODO: remove this debug stuff

export default database;
