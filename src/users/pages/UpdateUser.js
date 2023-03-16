import React, { useState } from "react";
import "./UpdateUser.css";
import Card from "../../shared/UIElements/Card";
import FormInput from "../../shared/UIElements/FormInput";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/Validators";
import ImagePicker from "../../shared/UIElements/ImagePicker";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const UpdateUser = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    name: {
      value: location.state.name,
      valid: true,
    },
    email: {
      value: location.state.email,
      valid: true,
    },
    photo: {
      value: undefined,
      valid: true,
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

  const formSubmitHandler = async (event) => {
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
      .patch(
        `https://pink-average-lamb.cyclic.app/api/v1/profile/update`,
        formData
      )
      .then(() => {
        toast("profile was updated successfully", {
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
        navigate("/users");
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
      <Card className="auth-container">
        <h1>Edit Profile</h1>
        <form className="auth-form" onSubmit={formSubmitHandler}>
          <FormInput
            name="name"
            type="name"
            label="Name"
            placeholder="Name"
            errorMessage="Please provide your name (atmost 40 characters)"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(40)]}
            onChange={changeHandler}
            value={values.name.value}
            isvalid={values.name.valid}
          ></FormInput>
          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="Email"
            errorMessage="Please enter a valid email"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
            onChange={changeHandler}
            value={values.email.value}
            isvalid={values.email.valid}
          ></FormInput>
          <ImagePicker values={values} onChange={changeHandler} />
          <button className="btn btn-upd" type="submit">
            Update
          </button>
          <button
            className="btn btn-upd"
            onClick={() => {
              navigate("/userprofile");
            }}
            type="button"
          >
            Cancel
          </button>
        </form>
      </Card>
    </>
  );
};

export default UpdateUser;
