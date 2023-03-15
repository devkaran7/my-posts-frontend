import React, { useEffect, useState } from "react";
import "./AllUsers.css";
import Card from "../../shared/UIElements/Card";
import UserSummary from "../components/UserSummary";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://pink-average-lamb.cyclic.app/api/v1/users")
      .then((result) => {
        setUsers(result.data.users);
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
      });
    setIsLoading(false);
  }, []);

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
      <Card className="all-users-container">
        <h1 className="all-users-heading">All Users</h1>
        <div className="all-users-grid">
          {users.map((user) => {
            return (
              <Link
                to={`/users/${user._id}`}
                style={{ textDecoration: "none" }}
                key={user._id}
              >
                <UserSummary {...user} />
              </Link>
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default AllUsers;
