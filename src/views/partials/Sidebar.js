import React from 'react';

class Sidebar extends React.Component {

   render() {
      let content;

      if(this.props.children) {
         let key = 0;
         content = [];
         for(let child of this.props.children) {
            function onClick() {
               let location = child.props.href.split("/").filter(value => value !== "");
               window.context.location = location;
            }

            let className = "side-option";
            if(child.props.href === window.context.location.join("/")) {
               className += " active";
            }

            let link = (
               <div key={key++} className={className} onClick={onClick}>{child.props.children}</div>
            );
            content.push(link);
         }
      }

      let heading = null;

      if(this.props.name) {
         heading = (
            <div className="sidebar-heading">
               {this.props.name}
            </div>
         );
      }

      return (
         <div className="sidebar">
            {heading}
            <div className="side-options">
               {content}
            </div>
         </div>
      );
   }
}

export default Sidebar;
