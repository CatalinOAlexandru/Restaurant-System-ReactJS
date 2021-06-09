import Role from "./Role";
import AccountManager from "./AccountManager";
import Snowflake from "../../io/Snowflake";

class Account {

   static load(data) {
      let role = Role.getById(data.role_id);
      return new Account(data.username, data.password, role, data.id);
   }

   static create(...data) {
      let account = new Account(...data);
      AccountManager.addAccount(account);
      return account;
   }

   constructor(username, password, role = Role.USER, id = null) {
      this._id = id || Snowflake.generate();
      this._username = username;
      this._password = password;
      this._role = role;
   }

   read() {
      return {
         id      : this._id,
         username: this._username,
         password: this._password,
         role_id : this._role.id
      };
   }

   update(data) {
      this._username = data.username;
      this._password = data.password;
      this._role = Role.getById(data.role_id);
   }

   get id() {
      return this._id;
   }

   get username() {
      return this._username;
   }

   set username(value) {
      this._username = value;
      this.save();
   }

   get role() {
      return this._role;
   }

   set role(value) {
      this._role = value;
      this.save();
   }

   /**
   * @param {String} password
   */
   set password(value) {
      this._password = value;
      this.save();
   }

   /**
   * @param {String} password
   */
   checkPassword(password) {
      return this._password === password;
   }

   save() {
      AccountManager.save();
   }
}

export default Account;
