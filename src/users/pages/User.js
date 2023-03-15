import React, { useContext, useEffect, useState } from "react";
import "./User.css";
import Card from "../../shared/UIElements/Card";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostSummary from "../../places/Components/PostSummary";
import AuthContext from "../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const User = (props) => {
  let userId = useParams().userId;
  const loggedInUser = useContext(AuthContext).userId;
  const navigate = useNavigate();
  let userDashboard;

  const [isLoading, setIsLoading] = useState(false);

  const [postType, setPostType] = useState("posts");

  if (props.userId) {
    //this means we are at userprofile page
    userId = props.userId;
    userDashboard = (
      <div>
        <div className="user-btn-control">
          <button
            className="btn"
            onClick={() => {
              navigate("/userprofile/update/password", {
                replace: true,
              });
            }}
          >
            Change Password
          </button>
          <button
            className="btn"
            onClick={() => {
              navigate("/userprofile/update", {
                replace: true,
                state: user,
              });
            }}
          >
            Edit Profile
          </button>
        </div>
        <select
          onChange={(event) => {
            setPostType(event.target.value);
          }}
          style={{ marginTop: "1rem" }}
        >
          <option value="posts">My posts</option>
          <option value="saved">Saved Posts</option>
        </select>
      </div>
    );
  } else if (loggedInUser === userId) {
    navigate("/userprofile", {
      replace: true,
    });
  }

  const [user, setUser] = useState();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://pink-average-lamb.cyclic.app/api/v1/users/" + userId)
      .then((result) => {
        setUser(result.data.user);
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
  }, [userId]);

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
      {user && (
        <>
          <Card className="user-info">
            <img src={user.photo.secure_url} alt={user.name} />
            <h1>{user.name}</h1>
            <p>{`${user.posts.length} ${
              user.posts.length > 1 ? "Posts" : "Post"
            }`}</p>
            {userDashboard && userDashboard}
          </Card>
          <div className="user-places">
            {user[postType].map((post) => {
              return (
                <PostSummary
                  key={post._id}
                  id={post._id}
                  photo={post.photo}
                  location={post.location}
                  caption={post.caption}
                  creator={post.creator}
                  likes={post.likes}
                  comments={post.comments}
                  createdAt={post.createdAt}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default User;
