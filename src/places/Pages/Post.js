import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostSummary from "../Components/PostSummary";
import BackDrop from "../../shared/UIElements/BackDrop";
import Modal from "../../shared/UIElements/Modal";
import { InfinitySpin } from "react-loader-spinner";
import axios from "axios";
import FormInput from "../../shared/UIElements/FormInput";
import { VALIDATOR_REQUIRE } from "../../shared/utils/Validators";
import { toast } from "react-toastify";
import "./Post.css";
import Card from "../../shared/UIElements/Card";
import Comment from "../../comments/Comment";

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [comment, setComment] = useState({
    value: "",
    valid: false,
  });
  const [comments, setComments] = useState([]);
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://pink-average-lamb.cyclic.app/api/v1/post/" + postId)
      .then((result) => {
        setPost(result.data.post);
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
    axios
      .get("https://pink-average-lamb.cyclic.app/api/v1/comments/" + postId)
      .then((result) => {
        setComments(result.data.comments);
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
  }, [postId, flag]);

  const addCommentHandler = () => {
    if (!comment.valid) {
      return toast("inputs are not valid", {
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
    }

    setIsLoading(true);
    axios
      .post(
        "https://pink-average-lamb.cyclic.app/api/v1/newcomment/" + postId,
        {
          text: comment.value,
        }
      )
      .then((result) => {
        setComments((prev) => {
          return [result.data.comment, ...prev];
        });
        toast("comment posted", {
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
        setComment({ value: "", valid: false });
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
    setCommentModal(false);
    setIsLoading(false);
  };

  const changeHandler = (event, isValid) => {
    setComment({ value: event.target.value, valid: isValid });
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
      {commentModal && (
        <Modal
          onConfirm={addCommentHandler}
          onCancel={() => {
            setCommentModal(false);
          }}
          buttonTitle="Comment"
        >
          <p>Post a comment!</p>
          <FormInput
            name="comment"
            type="comment"
            label="Comment"
            placeholder="Comment"
            errorMessage="please provide some text to post a comment"
            validators={[VALIDATOR_REQUIRE()]}
            value={comment.value}
            onChange={changeHandler}
          />
        </Modal>
      )}
      {post && (
        <div className="post-control">
          <PostSummary
            id={post._id}
            photo={post.photo}
            location={post.location}
            caption={post.caption}
            creator={post.creator}
            likes={post.likes}
            comments={comments}
            createdAt={post.createdAt}
          />
          <Card className="comments-container">
            <div className="comments-title">
              <h1>Comments</h1>
              <button
                className="btn"
                onClick={() => {
                  setCommentModal(true);
                }}
              >
                Comment on this post
              </button>
            </div>
            {comments.map((c) => {
              return (
                <div key={c._id}>
                  <hr />
                  <Comment comment={c} setFlag={setFlag} />
                </div>
              );
            })}
            {comment.length !== 0 && <hr />}
          </Card>
        </div>
      )}
    </>
  );
};

export default Post;
