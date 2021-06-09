import React from 'react';
import Navbar from "./Navbar";

class Header extends React.Component {

   render() {
      return (
         <header>
            <div className="logo-text">
               <span>R</span><span>2</span><span>S</span>
            </div>
            <Navbar />
            <div className="clear"></div>
         </header>
      );
   }
}

export default Header;
