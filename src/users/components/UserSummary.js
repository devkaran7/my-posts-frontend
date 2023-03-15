import React from "react";
import "./UserSummary.css";

const UserSummary = (props) => {
  return (
    <div className="user-summary-container">
      <img
        src={props.photo.secure_url}
        alt={props.name}
        className="user-summary-img"
      />
      <h2 className="user-summary-name">{props.name}</h2>
      <p className="user-summary-cnt">
        {props.posts.length} {props.posts.length > 1 ? "posts" : "post"}
      </p>
    </div>
  );
};

export default UserSummary;
