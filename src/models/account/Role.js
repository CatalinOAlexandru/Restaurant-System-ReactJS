class Role {

   static getById(role_id) {
      for(let role_key in Role) {
         let role = Role[role_key];

         if(!(role instanceof Role)) {
            continue;
         }

         if(role.id === role_id) {
            return role;
         }
      }

      return null;
   }

   static getAll() {
      let roles = [];

      for(let role_key in Role) {
         let role = Role[role_key];

         if(!(role instanceof Role)) {
            continue;
         }

         roles.push(role);
      }

      return roles;
   }

   constructor(id, name, sub_roles = []) {
      this.id = id;
      this.name = name;
      this._sub_roles = sub_roles;
   }

   is(role) {
      if(typeof role === "string") {
         role = Role[role.toUpperCase()];
      }

      if(this.id === role.id) {
         return true;
      }

      for(let sub_role of this._sub_roles) {
         if(sub_role.is(role)) {
            return true;
         }
      }

      return false;
   }
}

Role.NONE    = new Role(0, "None");
Role.USER    = new Role(1, "User");
Role.WAITER  = new Role(2, "Waiter",  [Role.USER]);
Role.COOK    = new Role(4, "Cook",    [Role.USER]);
Role.MANAGER = new Role(8, "Manager", [Role.WAITER, Role.COOK]);

export default Role;
