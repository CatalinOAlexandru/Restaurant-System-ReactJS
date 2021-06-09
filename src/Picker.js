import React from 'react';

/**
 * Render only a specific child element depending on supplied data
 */
class Picker extends React.Component {

   render() {
      for(let child of this.props.children) {
         if(child.props.address === window.context.location[0]) {
            return child;
         }
      }

      throw new Error(`No children are suitable for rendering!`);
   }
}

export default Picker;
