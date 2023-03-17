import React, { useState } from "react";
import Card from "../../shared/UIElements/Card";
import FormInput from "../../shared/UIElements/FormInput";
import { VALIDATOR_REQUIRE } from "../../shared/utils/Validators";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import PostImage from "../Components/PostImage";
import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const UpdatePost = () => {
  const navigate = useNavigate();
  const state = useLocation().state;

  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    location: {
      value: state.location,
      valid: true,
    },
    caption: {
      value: state.caption,
      valid: true,
    },
  });

  const changeHandler = (event, isValid) => {
    setValues({
      ...values,
      [event.target.name]: { value: event.target.value, valid: isValid },
    });
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    const data = {};
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
        data[v] = values[v].value;
      }
    }
    setIsLoading(true);
    axios
      .patch(
        `https://pink-average-lamb.cyclic.app/api/v1/post/update/${state.postId}`,
        data
      )
      .then((result) => {
        setIsLoading(false);
        toast("updated!", {
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
        navigate("/posts", { replace: true });
      })
      .catch((error) => {
        setIsLoading(false);
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
        console.log(error);
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
        <PostImage photo={state.photo} />
        <form className="new-place-form" onSubmit={formSubmitHandler}>
          <FormInput
            name="location"
            type="location"
            label="Location"
            placeholder="Location"
            errorMessage="location is required"
            validators={[VALIDATOR_REQUIRE()]}
            onChange={changeHandler}
            value={values.location.value}
            isvalid={values.location.valid}
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
            isvalid={values.caption.valid}
          />
          <button className="btn new-place-btn" type="submit">
            update
          </button>
          <button
            className="btn new-place-btn"
            type="button"
            onClick={() => {
              navigate("/posts");
            }}
          >
            Cancel
          </button>
        </form>
      </Card>
    </>
  );
};

export default UpdatePost;
