import React from 'react';

import Sidebar from "../partials/Sidebar";
import Content from "../partials/Content";

import Menu from "../../models/menu/Menu";
import MenuOption from "../../models/menu/MenuOption";
import Role from "../../models/account/Role";

class MenuComponent extends React.Component {

   render() {
      let {location} = window.context;

      if(location.length === 1) {
         location[1] = "create";
      } else {
         if(window.context.account == null || !window.context.account.role.is(Role.MANAGER)) {
            window.context.location = ["orders"];
         }
      }

      let option_elements = [
         <a key="create" href={`menu/create`}>Create Menu Option</a>
      ];

      for(let option of Menu.options) {
         let option_element = (
            <a key={option.id} href={`menu/${option.id}`}>{option.name}</a>
         );
         option_elements.push(option_element);
      }

      return [
         <Sidebar key="sidebar" name="Menu Items">
            {option_elements}
         </Sidebar>,
         <Content key="content">
            {
               location[1] === "create" ?
                  this._renderCreateMenuOption() : this._renderViewMenuOption()
            }
         </Content>
      ];
   }

   _renderViewMenuOption() {
      let menu_option = Menu.getOptionById(window.context.location[1]);

      return (
         <div>
            <h1>{menu_option.name}</h1>
            <div>This menu item costs £{menu_option.formatted_price}.</div>
         </div>
      );
   }

   _renderCreateMenuOption() {
      return (
         <div>
            <h1>Create Menu Item</h1>

            <table>
            <tbody>
            <tr>
               <td>
                  <label>Name</label>
                  <input type="text" placeholder="Enter name" id="create-menu-item-name" />

                  <label>Price</label>
                  <input type="number" placeholder="Enter price" id="create-menu-item-price" />
               </td>
            </tr>
            </tbody>
            </table>

            <div className="button" onClick={this._createMenuItem}>Create</div>
         </div>
      );
   }

   _createMenuItem() {
      let e_name  = document.getElementById("create-menu-item-name");
      let e_price = document.getElementById("create-menu-item-price");

      let price = parseFloat(parseFloat(e_price.value).toFixed(2));
      if(!(price >= 0 && price < Infinity)) {
         alert(`Invalid price: ${price}`);
         return;
      }

      if(e_name.value.length === 0) {
         alert(`Enter a menu item name!`);
         return;
      }

      let menu_option = MenuOption.create(e_name.value, price);
      window.context.location[1] = menu_option.id;

      e_name.value = "";
      e_price.value = "";
   }
}

export default MenuComponent;
