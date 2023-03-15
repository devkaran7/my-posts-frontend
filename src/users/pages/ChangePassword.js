import React, { useContext, useState } from "react";
import FormInput from "../../shared/UIElements/FormInput";
import "./ChangePassword.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from "../../shared/utils/Validators";
import { toast } from "react-toastify";
import axios from "axios";
import Card from "../../shared/UIElements/Card";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../shared/context/AuthContext";
import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const ChangePassword = () => {
  const { loginUser } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [values, setValues] = useState({
    oldpassword: {
      value: "",
      valid: false,
    },
    password: {
      value: "",
      valid: false,
    },
  });

  const changeHandler = (event, isValid) => {
    setValues({
      ...values,
      [event.target.name]: { value: event.target.value, valid: isValid },
    });
  };

  const formSubmitHandler = async (event) => {
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
      .patch(`https://pink-average-lamb.cyclic.app/api/v1/profile/update/password`, data)
      .then((result) => {
        loginUser(result.data.token, result.data.user._id);
        toast("password was updated successfully", {
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
        navigate("/places");
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
        <div className="loader-center">
          <InfinitySpin
            width="200"
            color="#2196f3"
            position="center"
            style={{ zIndex: "15" }}
          />
          <BackDrop />
        </div>
      )}
      <Card className="change-password-container">
        <h1>Change Password</h1>
        <form onSubmit={formSubmitHandler}>
          <FormInput
            name="oldpassword"
            type="password"
            label="Current Password"
            placeholder="Current Password"
            errorMessage="Please provide your current password"
            validators={[VALIDATOR_REQUIRE()]}
            onChange={changeHandler}
            value={values.oldpassword.value}
          />
          <FormInput
            name="password"
            type="password"
            label="New Password"
            placeholder="New Password"
            errorMessage="Please enter a new password (8 - 16 characters)"
            validators={[
              VALIDATOR_REQUIRE(),
              VALIDATOR_MINLENGTH(8),
              VALIDATOR_MAXLENGTH(16),
            ]}
            onChange={changeHandler}
            value={values.password.value}
          />
          <button type="submit" className="btn">
            Submit
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              navigate("/userprofile");
            }}
          >
            Cancel
          </button>
        </form>
      </Card>
    </>
  );
};

export default ChangePassword;
