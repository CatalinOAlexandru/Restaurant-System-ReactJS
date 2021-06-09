import React from 'react';

class Navbar extends React.Component {

   render() {
      return (
         <div className="menu">
            {window.context.role.is("user")    && item("orders",  "Orders" )}
            {window.context.role.is("manager") && item("menu",    "Menu"   )}
            {window.context.role.is("manager") && item("users",   "Users"  )}
            {window.context.role.is("user")    && item("account", "Account")}
            {window.context.role.is("manager") && item("report",  "Report" )}
            {window.context.account != null    && logoutItem()}
         </div>
      );
   }
}

function item(address, name) {
   function onClick() {
      window.context.location = [address];
      window.document.title = name + " | R2S";
   }

   let className = "menu-item";
   if(window.context.location[0] === address) {
      className += " active";
   }

   return (
      <span className={className} onClick={onClick}>{name}</span>
   );
}

function logoutItem() {
   function onClick() {
      window.context.account = null;
      window.context.location = [];
   }

   return (
      <span className="menu-item" onClick={onClick}>Logout</span>
   );
}

export default Navbar;
