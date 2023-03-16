import React, { useState } from "react";
import "./NewPost.css";
import Card from "../../shared/UIElements/Card";
import FormInput from "../../shared/UIElements/FormInput";
import { VALIDATOR_REQUIRE } from "../../shared/utils/Validators";
import { toast } from "react-toastify";
import ImagePicker from "../../shared/UIElements/ImagePicker";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const NewPost = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    location: {
      value: "",
      valid: false,
    },
    caption: {
      value: "",
      valid: false,
    },
    photo: {
      value: undefined,
      valid: false,
    },
  });

  const changeHandler = (event, isValid) => {
    if (event.target.name === "photo") {
      if (event.target.files && event.target.files.length > 0) {
        setValues({
          ...values,
          photo: { value: event.target.files[0], valid: true },
        });
      }
    } else {
      setValues({
        ...values,
        [event.target.name]: { value: event.target.value, valid: isValid },
      });
    }
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    for (const v in values) {
      if (values[v].valid === false) {
        return toast("Inputs are not valid", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          type: "error",
        });
      } else {
        formData.append(v, values[v].value);
      }
    }
    setIsLoading(true);
    axios
      .post(`https://pink-average-lamb.cyclic.app/api/v1/post/new`, formData)
      .then((result) => {
        toast("post created!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          type: "success",
        });
        setIsLoading(false);
        navigate("/posts");
      })
      .catch((error) => {
        toast(error.response.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          type: "error",
        });
        setIsLoading(false);
      });
  };

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
      <Card className="new-place-card">
        <h1 className="new-place-heading">New Post</h1>
        <form className="new-place-form" onSubmit={formSubmitHandler}>
          <ImagePicker values={values} onChange={changeHandler} />
          <FormInput
            name="location"
            type="location"
            label="Location"
            placeholder="Location"
            errorMessage="location is required"
            validators={[VALIDATOR_REQUIRE()]}
            onChange={changeHandler}
            value={values.location.value}
          />
          <FormInput
            name="caption"
            type="caption"
            label="Caption"
            placeholder="Caption"
            errorMessage="caption is required"
            validators={[VALIDATOR_REQUIRE()]}
            onChange={changeHandler}
            value={values.caption.value}
          />
          <button className="btn new-place-btn">Create</button>
        </form>
      </Card>
    </>
  );
};

export default NewPost;
