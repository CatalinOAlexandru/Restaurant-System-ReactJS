import React from 'react';

import Sidebar from "../partials/Sidebar";
import Content from "../partials/Content";

import AccountManager from "../../models/account/AccountManager";
import Account from "../../models/account/Account";
import Role from "../../models/account/Role";

class Users extends React.Component {

   render() {
      let {location} = window.context;

      if(location.length === 1) {
         location[1] = "create";
      } else {
         let account = AccountManager.getAccountById(window.context.location[1]);

         if(account == null) {
            window.context.location[1] = "create";
         }

         if(window.context.account == null || !window.context.account.role.is(Role.MANAGER)) {
            window.context.location = ["orders"];
         }
      }

      let account_elements = [
         <a key="create" href={`users/create`}>Create User</a>
      ];

      for(let account of AccountManager.accounts) {
         let account_element = (
            <a key={account.id} href={`users/${account.id}`}>{account.username}</a>
         );
         account_elements.push(account_element);
      }

      return [
         <Sidebar key="sidebar" name="Users">
            {account_elements}
         </Sidebar>,
         <Content key="content">
            {
               location[1] === "create" ?
                  this._renderCreateUser() : this._renderViewUser()
            }
         </Content>
      ];
   }

   _renderCreateUser() {
      return (
         <div>
            <h1>Create New User</h1>
            <div>Submitting this form creates a new account.</div><br/>

            <label>Username</label>
            <input type="text" placeholder="Enter username" id="create-user-username" />


            <label>Password</label>
            <input type="password" placeholder="Enter password" id="create-user-password-1" />

            <input type="password" placeholder="Enter password (again)" id="create-user-password-2" />

            <label>Role</label>
            {this._renderRoleSelect("create-user-role-id")}

            <div className="button" onClick={this.handleCreateUser}>
               Create User
            </div>
         </div>
      );
   }

   _renderRoleSelect(selected_role = null) {
      let role_elements = [];

      for(let role of Role.getAll()) {
         let role_element = (
            <option key={role.id} value={role.id}>{role.name}</option>
         );

         role_elements.push(role_element);
      }

      return (
         <select id="user-role-id">{role_elements}</select>
      );
   }

   handleCreateUser() {
      let e_password_1 = document.getElementById("create-user-password-1");
      let e_password_2 = document.getElementById("create-user-password-2");
      let e_username   = document.getElementById("create-user-username");
      let e_role_id    = document.getElementById("user-role-id");

      if(AccountManager.getAccountByUsername(e_username.value)) {
         alert(`This username is already taken- pick another.`);
         return;
      }

      if(e_username.value.length < 2 || e_username.value.length > 15) {
         alert(`Usernames must be 2 to 15 characters in length.`);
         return;
      }

      if(e_password_1.value !== e_password_2.value) {
         alert(`Passwords do not match!`);
         return;
      }

      if(e_password_1.value.length < 5) {
         alert(`Passwords must be at least 5 characters.`);
         return;
      }

      let role = Role.getById(parseInt(e_role_id.value));

      let account = Account.create(e_username.value,e_password_1.value,role);
      window.context.location = ["users", account.id];

      e_password_1.value = e_password_2.value = e_username.value = "";
      e_role_id.value = 0;
   }

   _renderViewUser() {
      let {location} = window.context;
      let account = AccountManager.getAccountById(location[1]);

      let others_only = null;
      if(account.id !== window.context.account.id) {
         others_only = (
            <div>
               <h2>Set Role</h2><br/>
               {this._renderRoleSelect(account.role)}
               <div className="button" onClick={this.handleChangeRole}>
                  Set Role
               </div>
               <br/>

               <h2>Delete User</h2><br/>
               <div className="button" onClick={this.handleDeleteUser}>
                  Delete User
               </div>
            </div>
         );
      }

      return (
         <div>
            <h1>{account.username}</h1>
            <div>They are a {account.role.name.toLowerCase()}.</div><br/>

            <h2>Set Username</h2><br/>

            <input type="text" placeholder="Enter new username" id="change-username-other" />

            <div className="button" onClick={this.handleChangeUsername}>
               Set Username
            </div>
            <br/>

            <h2>Set Password</h2><br/>

            <input type="password" placeholder="Enter password" id="change-password-1-other" />

            <input type="password" placeholder="Enter password (again)" id="change-password-2-other" />

            <div className="button" onClick={this.handleChangePassword}>
               Set Password
            </div>
            <br/>

            {others_only}
         </div>
      );
   }

   handleChangeUsername() {
      let {location} = window.context;
      let account = AccountManager.getAccountById(location[1]);

      let e_username   = document.getElementById("change-username-other");

      if(e_username.value.length < 2 || e_username.value.length > 15) {
         alert(`Usernames must be 2 to 15 characters in length.`);
         return;
      }

      account.username = e_username.value;
      e_username.value = "";
      window.context.update();
      alert(`Username updated!`);
   }

   handleChangePassword() {
      let {location} = window.context;
      let account = AccountManager.getAccountById(location[1]);

      let e_password_1   = document.getElementById("change-password-1-other");
      let e_password_2   = document.getElementById("change-password-2-other");

      if(e_password_1.value !== e_password_2.value) {
         alert(`Passwords do not match!`);
         return;
      }

      if(e_password_1.value.length < 5) {
         alert(`Passwords must be at least 5 characters.`);
         return;
      }

      account.password = e_password_1.value;
      e_password_1.value = e_password_2.value = "";
      window.context.update();
      alert(`Password updated!`);
   }

   handleChangeRole() {
      let {location} = window.context;
      let account = AccountManager.getAccountById(location[1]);

      let e_role_id  = document.getElementById("user-role-id");

      account.role = Role.getById(parseInt(e_role_id.value));
      window.context.update();
      alert(`Role updated!`);
   }

   handleDeleteUser() {
      let {location} = window.context;
      let account = AccountManager.getAccountById(location[1]);
      account.role = Role.NONE; // Ensure that access is revoked
      AccountManager.removeAccount(account);
      window.context.location = ["users", "create"];
   }
}

export default Users;
