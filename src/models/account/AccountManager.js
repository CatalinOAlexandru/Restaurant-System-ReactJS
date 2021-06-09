import Database from "../../io/Database";
import Account from "./Account";
import Role from "./Role";

class AccountManager {

   constructor() {
      this._accounts = new Set();
      Database.load("accounts", this);
   }

   load(data) {
      if(data == null) {
         return;
      }

      let removing = new Set([...this._accounts.values()]);

      for(let account_data of data) {
         let account = this.getAccountById(account_data.id);

         if(account == null) {
            account = Account.load(account_data);
            this._accounts.add(account);
         } else {
            account.update(account_data);
            removing.delete(account);
         }
      }

      for(let remove of removing.values()) {
         this._accounts.delete(remove);
      }

      // If no accounts present, create the default admin account
      if(this._accounts.size === 0) {
         let admin_account = new Account("Admin", "password", Role.MANAGER);
         this.addAccount(admin_account);
      }
   }

   read() {
      let data = [];

      for(let account of this._accounts.values()) {
         data.push(account.read());
      }

      return data;
   }

   save() {
      Database.write("accounts", this.read());
   }

   get accounts() {
      return [...this._accounts.values()];
   }

   getAccount(isTargetAccount = null) {
      let accounts = [...this._accounts.values()];
      return accounts.filter(isTargetAccount)[0] || null;
   }

   /**
   * @param {String} id
   */
   getAccountById(id) {
      return this.getAccount(a => a.id === id);
   }

   /**
   * @param {String} username
   */
   getAccountByUsername(username) {
      return this.getAccount(a => a.username.toLowerCase() === username.toLowerCase());
   }

   /**
   * @param {Account} account
   */
   addAccount(account) {
      this._accounts.add(account);
      this.save();
   }

   /**
   * @param {Account} account
   */
   removeAccount(account) {
      this._accounts.delete(account);
      this.save();
   }

}

export default (new AccountManager());
