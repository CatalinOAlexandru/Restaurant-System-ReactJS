import React from 'react';

class Content extends React.Component {

   render() {
      return (
         <div className="content-area">
            {this.props.children}
         </div>
      );
   }
}

export default Content;
