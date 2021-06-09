import React from 'react';

import AccountManager from "../../models/account/AccountManager";
import Role from "../../models/account/Role";

class Login extends React.Component {

   render() {
      return (
         <div className="login-wrapper">
            <form>
               <label>Username</label>
               <input type="text" placeholder="Enter username" id="login-username" />

               <label>Password</label>
               <input type="password" placeholder="Enter password" id="login-password" />

               <div className="button" onClick={this.handleLogin}>Login</div>
            </form>
         </div>
      );
   }

   handleLogin() {
      let e_username = document.getElementById("login-username");
      let e_password = document.getElementById("login-password");

      let account = AccountManager.getAccountByUsername(e_username.value);

      if(account == null || !account.checkPassword(e_password.value)) {
         alert(`Invalid credentials!`);
         return;
      }

      if(account.role.is(Role.NONE)) {
         alert(`You need a role to login.`);
         return;
      }

      window.context.account = account;
      window.context.location = ["orders"];
      window.document.title = "Orders | R2S";
   }
}

export default Login;
