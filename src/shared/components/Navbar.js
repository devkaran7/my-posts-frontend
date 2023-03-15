import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import SideDrawer from "../UIElements/SideDrawer";
import BackDrop from "../UIElements/BackDrop";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const drawerToggler = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <>
      {isDrawerOpen && (
        <>
          <BackDrop clickHandler={drawerToggler} />
          <SideDrawer clickHandler={drawerToggler}>
            <NavLinks />
          </SideDrawer>
        </>
      )}
      <div className="main-navigation">
        <h1 className="navbar-title">
          <Link to="/">MyPosts</Link>
        </h1>
        <div className="navbar-links">
          <NavLinks />
        </div>
        <button className="navbar-menu-btn" onClick={drawerToggler}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </>
  );
};

export default Navbar;
