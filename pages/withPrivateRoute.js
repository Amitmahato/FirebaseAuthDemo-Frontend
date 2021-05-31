import { AuthContext } from "./_app";
import React, { useContext, useEffect } from "react";
import Router from "next/router";

const PrivateComponent = ({ children }) => {
  const { loading, user } = useContext(AuthContext);
  useEffect(() => {
    if (!loading) {
      if (!user) {
        Router.push("/login");
      }
    }
  }, [loading, user]);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return user && children;
};

const PrivateRoute = (AuthenticatedComponent) => {
  return class HigherOrderComponent extends React.Component {
    render() {
      return (
        <PrivateComponent>
          <AuthenticatedComponent {...this.props} />
        </PrivateComponent>
      );
    }
  };
};

export default PrivateRoute;
