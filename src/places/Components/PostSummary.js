import React, { useContext, useState, useEffect } from "react";
import "./PostSummary.css";
import Card from "../../shared/UIElements/Card";
import { BiComment, BiEdit } from "react-icons/bi";
import { BsBookmarkHeartFill, BsBookmarkHeart } from "react-icons/bs";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../shared/context/AuthContext";
import axios from "axios";
import PostImage from "./PostImage";
import { toast } from "react-toastify";
import { InfinitySpin } from "react-loader-spinner";
import BackDrop from "../../shared/UIElements/BackDrop";
import Modal from "../../shared/UIElements/Modal";
import { msToTime } from "../../shared/utils/msToTime";

const PostSummary = (props) => {
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState();
  const [modalVisble, setModalVisible] = useState(false);
  const [isLiked, setIsLiked] = useState();
  const [likesCnt, setLikesCnt] = useState(props.likes.length);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsLiked(props.likes.find((p) => p.toString() === userId.toString()));
      axios
        .get("https://pink-average-lamb.cyclic.app/api/v1/users/" + userId)
        .then((res) => {
          setIsSaved(
            res.data.user.saved.find(
              (p) => p._id.toString() === props.id.toString()
            )
          );
        })
        .catch((error) => {
          console.log(error);
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
    } else {
      setIsSaved(undefined);
      setIsLiked(undefined);
    }
  }, [userId, props.likes, props.id]);

  const postDeleteHandler = () => {
    setModalVisible(false);
    setIsLoading(true);
    axios
      .delete(
        "https://pink-average-lamb.cyclic.app/api/v1/post/delete/" + props.id
      )
      .then((result) => {
        toast(result.data.message, {
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
        if (props.setFlag) {
          props.setFlag((prev) => prev + 1);
        } else {
          navigate("/posts");
        }
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
      });
  };

  const likeHandler = () => {
    setIsLoading(true);
    axios
      .post("https://pink-average-lamb.cyclic.app/api/v1/post/like/" + props.id)
      .then((result) => {
        setIsLiked((prev) => !prev);
        if (result.data.message === "disliked") {
          setLikesCnt((prev) => prev - 1);
        } else {
          setLikesCnt((prev) => prev + 1);
        }
        toast(result.data.message, {
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

  const saveHandler = () => {
    setIsLoading(true);
    axios
      .post("https://pink-average-lamb.cyclic.app/api/v1/post/save/" + props.id)
      .then((result) => {
        setIsSaved((prev) => !prev);
        toast(result.data.message, {
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
      {modalVisble && (
        <Modal
          onConfirm={postDeleteHandler}
          onCancel={() => {
            setModalVisible(false);
          }}
          buttonColor="red"
          buttonTitle="Delete"
        >
          <p>
            Are you sure you want to delete this post? Deleting this post is
            irreversible!
          </p>
        </Modal>
      )}
      <Card style={{ margin: "2rem 0", color: "grey" }}>
        <div className="summary-header">
          <span>
            <Link className="creator-name" to={`/users/${props.creator._id}`}>
              {props.creator.name}
            </Link>
            {` posted ${msToTime(
              Math.abs(Date.now() - new Date(props.createdAt))
            )} ago`}
          </span>
          <span>
            {isSaved ? (
              <BsBookmarkHeartFill
                className="summary-icons"
                onClick={saveHandler}
              />
            ) : (
              <BsBookmarkHeart
                className="summary-icons"
                onClick={saveHandler}
              />
            )}
            {userId === props.creator._id && (
              <BiEdit
                className="summary-icons"
                onClick={() => {
                  navigate("/posts/update/" + props.id, {
                    state: {
                      postId: props.id,
                      photo: props.photo,
                      location: props.location,
                      caption: props.caption,
                    },
                  });
                }}
              />
            )}
            {userId === props.creator._id && (
              <MdDeleteOutline
                className="summary-icons"
                style={{ color: "red" }}
                onClick={() => {
                  setModalVisible(true);
                }}
              />
            )}
          </span>
        </div>
        <PostImage photo={props.photo} />
        <p className="summary-caption">{props.caption}</p>
        <div className="summary-footer">
          <div className="summary-interaction">
            <span onClick={likeHandler}>
              {isLiked ? (
                <AiTwotoneLike className="summary-icons" />
              ) : (
                <AiOutlineLike className="summary-icons" />
              )}{" "}
              {likesCnt} likes
            </span>
            <span
              onClick={() => {
                navigate("/posts/" + props.id);
              }}
            >
              <BiComment className="summary-icons" /> {props.comments.length}{" "}
              comments
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default PostSummary;
