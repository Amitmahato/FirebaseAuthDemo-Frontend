import PrivateRoute from "./withPrivateRoute";

const Home = () => {
  return <h1>Index</h1>;
};

export default PrivateRoute(Home);
