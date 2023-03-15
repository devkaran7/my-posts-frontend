import React from "react";
import "./SideDrawer.css";

const SideDrawer = ({ children, clickHandler }) => {
  return (
    <div className="side-drawer-container" onClick={clickHandler}>
      {children}
    </div>
  );
};

export default SideDrawer;
