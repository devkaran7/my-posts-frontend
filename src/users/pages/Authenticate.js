import React, { useContext, useState } from "react";
import "./Authenticate.css";
import Card from "../../shared/UIElements/Card";
import FormInput from "../../shared/UIElements/FormInput";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/Validators";
import ImagePicker from "../../shared/UIElements/ImagePicker";
import { toast } from "react-toastify";
import axios from "axios";
import AuthContext from "../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";

import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const Authenticate = () => {
  const navigate = useNavigate();

  const { loginUser } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    name: {
      value: "",
      valid: isLogin,
    },
    email: {
      value: "",
      valid: false,
    },
    password: {
      value: "",
      valid: false,
    },
    photo: {
      value: undefined,
      valid: isLogin,
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
      .post(
        `https://pink-average-lamb.cyclic.app/api/v1/${
          isLogin ? "login" : "signup"
        }`,
        formData
      )
      .then((result) => {
        loginUser(result.data.token, result.data.user._id);
        toast("Welcome", {
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
      <Card className="auth-container">
        <h1>{isLogin ? "User Login" : "Register"}</h1>
        <form className="auth-form">
          {!isLogin && (
            <FormInput
              name="name"
              type="name"
              label="Name"
              placeholder="Name"
              errorMessage="Please provide your name (atmost 40 characters)"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(40)]}
              onChange={changeHandler}
              value={values.name.value}
            ></FormInput>
          )}
          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="Email"
            errorMessage="Please enter a valid email id"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE()]}
            onChange={changeHandler}
            value={values.email.value}
          ></FormInput>
          <FormInput
            name="password"
            type="password"
            label="Password"
            placeholder="Password"
            errorMessage="Please enter your password (8 - 16 characters)"
            validators={[
              VALIDATOR_REQUIRE(),
              VALIDATOR_MINLENGTH(8),
              VALIDATOR_MAXLENGTH(16),
            ]}
            onChange={changeHandler}
            value={values.password.value}
          ></FormInput>
          {!isLogin && <ImagePicker values={values} onChange={changeHandler} />}
          <button className="btn" onClick={formSubmitHandler} type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          className="btn"
          onClick={() => {
            setIsLogin((prev) => {
              values.name.valid = !prev;
              values.photo.valid = !prev;
              return !prev;
            });
          }}
        >
          {isLogin ? "Create a new account" : "Login instead"}
        </button>
      </Card>
    </>
  );
};

export default Authenticate;
