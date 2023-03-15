import React from "react";
import "./ImagePicker.css";

const ImagePicker = (props) => {
  const { values, onChange } = props;
  return (
    <div className="image-previewer-container">
      <label htmlFor="photo">Pick an Image</label>
      <input
        name="photo"
        id="photo"
        type="file"
        accept=".png, .jpg, .jpeg"
        max="1"
        min="1"
        style={{ display: "none" }}
        onChange={onChange}
      />
      {values.photo.value && (
        <img src={URL.createObjectURL(values.photo.value)} alt="preview" />
      )}
    </div>
  );
};

export default ImagePicker;
