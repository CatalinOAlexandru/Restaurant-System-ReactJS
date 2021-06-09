import Role from "./account/Role";

const proxy_handlers = {
   get(object, property) { // Proxy any objects contained in this one too!
      let value = object[property];

      if(typeof value === "object" && value != null) {
         return new Proxy(value, proxy_handlers);
      }

      return value;
   },

   set(object, property, value) {
      object[property] = value;

      if(property === "onUpdate") {
         return;
      }

      window.context.update();
      return true;
   },

   deleteProperty(object, property) {
      let result = delete object[property];

      if(property === "onUpdate") {
         return;
      }

      window.context.update();
      return result;
   }
};

/**
 * Store the current state and inform listeners of updates
 */
class Context {

   constructor() {
      this.account = null;
      this.location = [];
      this._update_handlers = [];

      // Proxy any modifications to this object to add a call to this.onUpdate()
      return new Proxy(this, proxy_handlers);
   }

   onUpdate(callback) {
      this._update_handlers.push(callback);
   }

   update() {
      setTimeout(() => {
         for(let callback of this._update_handlers) {
            callback();
         }
      }, 0);
   }

   get role() {
      if(this.account == null) {
         return Role.NONE;
      } else {
         return this.account.role;
      }
   }
}

window.context = new Context();
