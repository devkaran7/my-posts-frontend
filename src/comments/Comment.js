import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../shared/context/AuthContext";
import { MdDeleteOutline } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import "./Comment.css";
import axios from "axios";
import BackDrop from "../shared/UIElements/BackDrop";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import Modal from "../shared/UIElements/Modal";
import FormInput from "../shared/UIElements/FormInput";
import { VALIDATOR_REQUIRE } from "../shared/utils/Validators";

const Comment = ({ comment, setFlag }) => {
  const msToTime = (ms) => {
    let seconds = (ms / 1000).toFixed(0);
    let minutes = (ms / (1000 * 60)).toFixed(0);
    let hours = (ms / (1000 * 60 * 60)).toFixed(0);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
    if (seconds < 60) return seconds + " s";
    else if (minutes < 60) return minutes + " m";
    else if (hours < 24) return hours + " h";
    else return days + " d";
  };

  const { userId } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [loadedComment, setLoadedComment] = useState({
    value: comment.text,
    valid: true,
  });

  const deleteHandler = () => {
    setIsLoading(true);
    axios
      .delete("https://pink-average-lamb.cyclic.app/api/v1/comment/" + comment._id)
      .then(() => {
        toast("comment deleted", {
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
        setFlag((prev) => prev + 1);
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
  };

  const changeHandler = (event, isValid) => {
    setLoadedComment({ value: event.target.value, valid: isValid });
  };

  const updateHandler = () => {
    if (loadedComment.valid === false) {
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
      .patch("https://pink-average-lamb.cyclic.app/api/v1/comment/" + comment._id, {
        text: loadedComment.value,
      })
      .then(() => {
        toast("comment updated", {
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
        setFlag((prev) => prev + 1);
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

  return (
    <>
      {isLoading && (
        <div className="loader-center">
          <BackDrop />
          <InfinitySpin
            width="200"
            color="#2196f3"
            position="center"
            style={{ zIndex: "15" }}
          />
        </div>
      )}
      {commentModal && (
        <Modal
          onConfirm={updateHandler}
          onCancel={() => {
            setCommentModal(false);
          }}
          buttonTitle="Update"
        >
          <p>Edit your comment!</p>
          <FormInput
            name="comment"
            type="comment"
            label="Comment"
            placeholder="Comment"
            errorMessage="please provide some text to post a comment"
            validators={[VALIDATOR_REQUIRE()]}
            value={loadedComment.value}
            onChange={changeHandler}
            isvalid={loadedComment.valid}
          />
        </Modal>
      )}
      <div className="comment-container">
        <div className="summary-header">
          <span style={{ color: "grey" }}>
            <Link to={`/users/${comment.creator._id}`}>
              <h2>{comment.creator.name}</h2>
            </Link>
            {` commented ${msToTime(
              Date.now() - new Date(comment.createdAt)
            )} ago`}
          </span>
          {userId === comment.creator._id.toString() && (
            <span>
              <BiEdit
                className="summary-icons"
                onClick={() => {
                  setCommentModal(true);
                }}
              />
              <MdDeleteOutline
                className="summary-icons"
                style={{ color: "red" }}
                onClick={deleteHandler}
              />
            </span>
          )}
        </div>
        <div className="comment">
          <p>{comment.text}</p>
        </div>
      </div>
    </>
  );
};

export default Comment;
