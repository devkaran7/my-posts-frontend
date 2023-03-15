import React from "react";
import "./PostImage.css";

const PostImage = (props) => {
  return (
    <div className="post-image-control">
      <img
        className="post-image"
        src={props.photo.secure_url}
        alt={props.photo.id}
      />
    </div>
  );
};

export default PostImage;
