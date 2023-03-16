import React, { useEffect, useState } from "react";
import PostSummary from "../Components/PostSummary";
import "./AllPosts.css";
import axios from "axios";
import { toast } from "react-toastify";
import Card from "../../shared/UIElements/Card";
import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";

const AllPosts = () => {
  const [posts, setPosts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://pink-average-lamb.cyclic.app/api/v1/posts")
      .then((result) => {
        setPosts(result.data.posts);
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
  }, [flag]);

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
      {posts && (
        <div className="all-places-container">
          {posts.length === 0 && (
            <Card
              style={{
                width: "70%",
                margin: "2rem auto",
                textAlign: "center",
                color: "#2196f3",
              }}
            >
              <h1>No posts, create one now!</h1>
            </Card>
          )}
          {posts.map((post) => {
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
                setFlag={setFlag}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default AllPosts;
