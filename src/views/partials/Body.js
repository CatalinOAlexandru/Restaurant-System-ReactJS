import React from 'react';

class Body extends React.Component {

   render() {
      return (
         <div className="container">
            <div className="split-wrapper">
               {this.props.children}
            </div>
         </div>
      );
   }
}

export default Body;
