import React from 'react';

import Sidebar from "../partials/Sidebar";
import Content from "../partials/Content";

import OrderManager from "../../models/order/OrderManager";
import OrderStatus  from "../../models/order/OrderStatus";
import Role  from "../../models/account/Role";

class Report extends React.Component {

   render() {
      if(window.context.account == null || !window.context.account.role.is(Role.MANAGER)) {
         window.context.location = ["orders"];
      }

      return [
         <Sidebar key="sidebar"></Sidebar>,
         <Content key="content">
            <table>
            <tbody>
               <tr>
                  <th>Timespan</th>
                  <th>Completed Orders</th>
                  <th>Rejected Orders</th>
                  <th>Total Income</th>
               </tr>
               {this._renderRow("Last Minute", 60)}
               {this._renderRow("Last Day", 86400)}
               {this._renderRow("Last Week", 86400*7)}
               {this._renderRow("Last Month", 86400*30)}
            </tbody>
            </table>
            <br/>
            <div className="button" onClick={this.refresh}>Refresh</div>
         </Content>
      ];
   }

   refresh() {
      window.context.update();
      alert(`Report updated!`);
   }

   _renderRow(last_time_label, last_x_seconds) {
      let min_timestamp = Date.now() - last_x_seconds * 1000;
      let orders = OrderManager.orders.filter(
         order => order.timestamp >= min_timestamp
      );

      let accepted = orders.filter(
         order => order.status === OrderStatus.PREPARED
      );

      let total_income = 0;

      for(let order of accepted) {
         total_income += order.price;
      }

      let rejected_count = orders.filter(
         order => order.status === OrderStatus.REJECTED
      ).length;

      return (
         <tr>
            <td>{last_time_label}</td>
            <td>{accepted.length}</td>
            <td>{rejected_count}</td>
            <td>£{total_income.toFixed(2)}</td>
         </tr>
      );
   }
}

export default Report;
