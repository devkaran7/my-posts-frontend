import React, { useContext, useEffect } from "react";
import Navbar from "./shared/components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AllPosts from "./places/Pages/AllPosts";
import NewPost from "./places/Pages/NewPost";
import AllUsers from "./users/pages/AllUsers";
import User from "./users/pages/User";
import Authenticate from "./users/pages/Authenticate";
import AuthContext from "./shared/context/AuthContext";
import ChangePassword from "./users/pages/ChangePassword";
import UpdateUser from "./users/pages/UpdateUser";
import UpdatePost from "./places/Pages/UpdatePost";
import PageNotFound from "./shared/pages/PageNotFound";
import Post from "./places/Pages/Post";

const App = () => {
  const { userId, loginUser } = useContext(AuthContext);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      loginUser(token, user);
    }
  }, [loginUser]);

  let conditionalRoutes = (
    <Route path="/authenticate" element={<Authenticate />} />
  );

  if (userId) {
    conditionalRoutes = (
      <React.Fragment>
        <Route path="/newpost" element={<NewPost />} />
        <Route path="/userprofile" element={<User userId={userId} />} />
        <Route path="/userprofile/update" element={<UpdateUser />} />
        <Route
          path="/userprofile/update/password"
          element={<ChangePassword />}
        />
        <Route path="/posts/update/:postId" element={<UpdatePost />} />
      </React.Fragment>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/posts" />} />
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/posts/:postId" element={<Post />} />
        <Route path="/users" element={<AllUsers />} />
        <Route path="/users/:userId" element={<User />} />
        {conditionalRoutes}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
