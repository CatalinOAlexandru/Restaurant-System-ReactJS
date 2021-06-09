import React from 'react';

import Sidebar from "../partials/Sidebar";
import Content from "../partials/Content";

import OrderManager from "../../models/order/OrderManager";
import OrderStatus  from "../../models/order/OrderStatus";
import Order        from "../../models/order/Order";
import Menu from "../../models/menu/Menu";

const state = {
   create_options: {}
};

class Orders extends React.Component {

   constructor(props) {
      super(props);

      window.context.onUpdate(() => {
         if(!(window.context.location[0] === "orders" &&
            window.context.location[1] === "create"
         )) state.create_options = {};
      });
   }

   render() {
      if(window.context.location.length === 2) {
         let order = OrderManager.getOrderById(window.context.location[1]);

         if(order == null || order.status !== OrderStatus.PLACED) {
            window.context.location.length = 1;
         }
      }

      let order_elements = [];

      if(window.context.role.is("waiter")) {
         order_elements.push(
            <a key="create" href={`orders/create`}>Create Order</a>
         );
      }

      for(let order of OrderManager.getOrdersByStatus(OrderStatus.PLACED)) {
         let order_element = (
            <a key={order.id} href={`orders/${order.id}`}>Table #{order.table_number}</a>
         );
         order_elements.push(order_element);
      }

      if(window.context.location.length === 1) {
         if(window.context.role.is("waiter")) {
            window.context.location[1] = "create";
         }
         else return [
            <Sidebar key="sidebar" name="Orders">
               {order_elements}
            </Sidebar>,
            <Content key="content">
               <h1>View Orders</h1>
               Use the sidebar on the left to view orders.
            </Content>
         ];
      }

      return [
         <Sidebar key="sidebar" name="Orders">
            {order_elements}
         </Sidebar>,
         <Content key="content">
            {
               window.context.location[1] === "create" ?
                  this._renderCreateOrder() : this._renderViewOrder()
            }
         </Content>
      ];
   }

   _renderMenuOptions() {
      let menu_option_elements = [];

      for(let menu_option_id in state.create_options) {
         if(!state.create_options.hasOwnProperty(menu_option_id)) {
            continue;
         }
         let menu_option = Menu.getOptionById(menu_option_id);
         let quantity = state.create_options[menu_option.id];

         function increment() {
            state.create_options[menu_option.id]++;
            window.context.update();
         }

         function decrement() {
            state.create_options[menu_option.id]--;

            if(state.create_options[menu_option.id] === 0) {
               delete state.create_options[menu_option.id];
            }

            window.context.update();
         }


         let menu_option_element = (
            <div key={menu_option.id} className="order-menu-option">
               <div className="quantity-button" onClick={increment}>+</div>
               <div className="quantity-button" onClick={decrement}>-</div>
               <div><b>{menu_option.name}</b> (x{quantity})</div>
               <small>£{menu_option.formatted_price}</small>
            </div>
         );

         menu_option_elements.push(menu_option_element);
      }

      return menu_option_elements;
   }

   _renderCreateOrder() {
      let order_menu_options = [
         (
            <option key="default" value="none">Add menu option</option>
         )
      ];

      for(let menu_option of Menu.options) {
         let order_menu_option = (
            <option key={menu_option.id} value={menu_option.id}>{menu_option.name}</option>
         );
         order_menu_options.push(order_menu_option);
      }

      return (
         <div>
            <h1>Create New Order</h1>

            <table>
            <tbody>
            <tr>
               <td>
                  <label>Table Number</label>
                  <input type="number" placeholder="Enter table number" id="create-order-table-number" />

                  <div className="button" onClick={this.createNewOrder}>Create</div>

               </td>
               <td>
                  <select value="default" onChange={this._addMenuOptionToOrder} id="order-menu-option">{order_menu_options}</select>
                  {this._renderMenuOptions()}
               </td>
            </tr>
            </tbody>
            </table>
         </div>
      );
   }

   _addMenuOptionToOrder({target}) {
      if(target.value === "none") {
         return;
      }

      let menu_option_quantity = state.create_options[target.value];

      if(menu_option_quantity == null) {
         menu_option_quantity = 1;
      } else {
         menu_option_quantity++;
      }

      state.create_options[target.value] = menu_option_quantity;
      window.context.update();
   }

   _renderViewOrder() {
      let {location} = window.context;
      let order = OrderManager.getOrderById(location[1]);

      let menu_option_elements = [];

      for(let [menu_option_id, quantity] of order.menu_options) {
         let menu_option = Menu.getOptionById(menu_option_id);

         let menu_option_element = (
            <div key={menu_option.id} className="order-menu-option">
               <div><b>{menu_option.name}</b> (x{quantity})</div>
               <small>£{menu_option.formatted_price}</small>
            </div>
         );

         menu_option_elements.push(menu_option_element);
      }

      return (
         <div>
            <h1>Order for Table #{order.table_number}</h1>

            <table>
            <tbody>
            <tr>
               <td>
                  {
                     window.context.role.is("cook") ? [
                        <div key="1" className="button" onClick={this.markOrderReady}>Mark as Completed</div>,
                        <div key="2" className="mini-break"></div>,
                        <div key="3" className="button" onClick={this.rejectOrder}>Reject</div>
                     ] : (
                        <div>Kitchen staff will mark this order as completed or reject it.</div>
                     )
                  }
               </td>
               <td>
                  {menu_option_elements}
                  <div className="mini-break"></div>
                  <b>Total price: </b>£{order.formatted_price}
               </td>
            </tr>
            </tbody>
            </table>
         </div>
      );
   }

   createNewOrder() {
      let e_table_number = document.getElementById("create-order-table-number");
      let table_number = parseInt(e_table_number.value);

      if(!(table_number >= 0)) {
         alert("You must enter a table number.");
         return;
      }

      if(Object.values(state.create_options).length === 0) {
         alert("You must add at least one menu option.");
         return;
      }

      let order = Order.create(OrderStatus.PLACED, table_number);

      for(let menu_option_id in state.create_options) {
         if(!state.create_options.hasOwnProperty(menu_option_id)) {
            continue;
         }

         let menu_option = Menu.getOptionById(menu_option_id);
         let quantity = state.create_options[menu_option_id];

         order.addMenuOption(menu_option, quantity);
      }

      window.context.location[1] = order.id;
   }

   markOrderReady() {
      let {location} = window.context;
      let order = OrderManager.getOrderById(location[1]);

      order.status = OrderStatus.PREPARED;
      window.context.location.length = 1;
   }

   rejectOrder() {
      let {location} = window.context;
      let order = OrderManager.getOrderById(location[1]);

      order.status = OrderStatus.REJECTED;
      window.context.location.length = 1;
   }
}

export default Orders;
