import React from 'react';
import ReactDOM from 'react-dom';

import "./style/_bundle.css";
import "./models/Context";

import Picker from "./Picker";
import Header  from "./views/partials/Header";
import Body    from "./views/partials/Body";

import Login  from "./views/pages/Login";
import Orders from "./views/pages/Orders";
import Menu   from "./views/pages/Menu";
import Account from "./views/pages/Account";
import Users from "./views/pages/Users";
import Report from "./views/pages/Report";

import Role from "./models/account/Role";

class App extends React.Component {

   componentWillMount() {
      window.context.onUpdate(this.forceUpdate.bind(this));
   }

   render() {
      let location = null;

      if(window.context && window.context.location[0]) {
         location = window.context.location[0].toLowerCase();
         location = "location-" + location;
      } else {
         location = "location-none";
      }

      if(window.context.role.is(Role.NONE)) {
         window.context.location = [];
         window.context.account = null;
      }

      return (
         <div id="wrapper" className={location}>
            <Header />
            <Body>
               <Picker>
                  <Login />
                  <Orders  address="orders"  />
                  <Menu    address="menu"    />
                  <Users   address="users"   />
                  <Account address="account" />
                  <Report  address="report"  />
               </Picker>
            </Body>
         </div>
      );
   }
}

ReactDOM.render(<App />, document.getElementById('root'));
