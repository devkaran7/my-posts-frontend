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
import { msToTime } from "../shared/utils/msToTime";

const Comment = ({ comment, setFlag }) => {
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
      .delete(
        "https://pink-average-lamb.cyclic.app/api/v1/comment/" + comment._id
      )
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
      .patch(
        "https://pink-average-lamb.cyclic.app/api/v1/comment/" + comment._id,
        {
          text: loadedComment.value,
        }
      )
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
        <>
          <BackDrop />
          <div className="loader-center">
            <InfinitySpin width="200" color="#2196f3" position="center" />
          </div>
        </>
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
            <Link className="creator-name" to={`/users/${comment.creator._id}`}>
              {comment.creator.name}
            </Link>
            {` commented ${msToTime(
              Math.abs(Date.now() - new Date(comment.createdAt))
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
