import React, { useContext, useState } from "react";
import "./NavLinks.css";
import { NavLink } from "react-router-dom";

import AuthContext from "../context/AuthContext";

import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const NavLinks = () => {
  const activeStyle = {
    backgroundColor: "#2196F3",
    color: "white",
  };

  const [isLoading, setIsLoading] = useState(false);

  const { userToken, logoutUser } = useContext(AuthContext);
  return (
    <>
      {isLoading && (
        <>
          <BackDrop />
          <div className="loader-center">
            <InfinitySpin width="200" color="#2196f3" position="center" />
          </div>
        </>
      )}
      <div className="nav-links">
        <span>
          <NavLink
            to="/posts"
            style={({ isActive }) => {
              return isActive ? activeStyle : undefined;
            }}
          >
            ALL POSTS
          </NavLink>
        </span>
        <span>
          <NavLink
            to="/users"
            style={({ isActive }) => {
              return isActive ? activeStyle : undefined;
            }}
          >
            ALL USERS
          </NavLink>
        </span>
        {userToken && (
          <span>
            <NavLink
              to="/newpost"
              style={({ isActive }) => {
                return isActive ? activeStyle : undefined;
              }}
            >
              CREATE POST
            </NavLink>
          </span>
        )}
        {userToken && (
          <span>
            <NavLink
              to="/userprofile"
              style={({ isActive }) => {
                return isActive ? activeStyle : undefined;
              }}
            >
              MY PROFILE
            </NavLink>
          </span>
        )}
        {userToken && (
          <button
            className="btn"
            onClick={() => {
              logoutUser(setIsLoading);
            }}
          >
            LOGOUT
          </button>
        )}
        {!userToken && (
          <span>
            <NavLink
              to="/authenticate"
              style={({ isActive }) => {
                return isActive ? activeStyle : undefined;
              }}
            >
              AUTHENTICATE
            </NavLink>
          </span>
        )}
      </div>
    </>
  );
};

export default NavLinks;
