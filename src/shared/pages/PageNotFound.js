import React from "react";
import Card from "../UIElements/Card";

const PageNotFound = () => {
  return (
    <Card style={{ margin: "2rem auto", width: "60%", textAlign: "center" }}>
      <h1 style={{ color: "#2196f3", margin: "1rem" }}>Page Not Found!</h1>
      <p style={{ color: "grey" }}>
        The page that you are looking for does not exists!
      </p>
    </Card>
  );
};

export default PageNotFound;
