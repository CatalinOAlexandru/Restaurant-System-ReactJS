import React from 'react';

import Sidebar from "../partials/Sidebar";
import Content from "../partials/Content";

class Account extends React.Component {

   render() {
      let {account} = window.context;

      return [
         <Sidebar key="sidebar" />,
         <Content key="content">
            <h1>You are {account.username}</h1>
            <div>You are a {account.role.name.toLowerCase()}.</div><br/>

            <h2>Change Username</h2><br/>

            <input type="text" placeholder="Enter new username" id="change-username" />

            <div className="button" onClick={this.handleChangeUsername}>
               Change Username
            </div>
            <br/>

            <h2>Change Password</h2><br/>

            <input type="password" placeholder="Enter password" id="change-password-1" />

            <input type="password" placeholder="Enter password (again)" id="change-password-2" />

            <div className="button" onClick={this.handleChangePassword}>
               Change Password
            </div>
         </Content>
      ];
   }

   handleChangeUsername() {
      let {account} = window.context;

      let e_username = document.getElementById("change-username");

      if(e_username.value.length < 2 || e_username.value.length > 15) {
         alert(`Usernames must be 2 to 15 characters in length.`);
         return;
      }

      account.username = e_username.value;

      e_username.value = "";
      alert(`Username changed.`);
   }

   handleChangePassword() {
      let {account} = window.context;

      let e_password_1 = document.getElementById("change-password-1");
      let e_password_2 = document.getElementById("change-password-2");

      if(e_password_1.value !== e_password_2.value) {
         alert(`Passwords do not match!`);
         return;
      }

      if(e_password_1.value.length < 5) {
         alert(`Passwords must be at least 5 characters.`);
         return;
      }

      account.password = e_password_1.value;
      window.context.location = ["account"];

      e_password_1.value = e_password_2.value = "";
      alert(`Password changed.`);
   }
}

export default Account;
