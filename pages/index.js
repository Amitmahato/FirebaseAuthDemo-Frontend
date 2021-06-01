import axios from "axios";
import firebase from "firebase";
import { useContext, useEffect, useState } from "react";
import PrivateRoute from "./withPrivateRoute";
import { AuthContext } from "./_app";

const Home = () => {
  const { user: fbUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [storedUserInfo, setStoredUserInfo] = useState(null);

  useEffect(() => {
    (async () => {
      const IdToken = await firebase.auth().currentUser.getIdToken();
      const res = await axios.get("/api/user", {
        headers: {
          authorization: `Bearer ${IdToken}`,
        },
      });
      const _user = res.data;
      if (_user) {
        setStoredUserInfo(_user);
      }
      setLoading(false);
    })();
  }, [fbUser]);

  return loading ? (
    <div>Loading...</div>
  ) : storedUserInfo ? (
    <div>
      {Object.keys(storedUserInfo).map((key) => {
        return (
          <div>
            <span>{key}</span> : <span>{storedUserInfo[key]}</span>
          </div>
        );
      })}
      <button onClick={() => firebase.auth().signOut()}>Logout</button>
    </div>
  ) : null;
};

export default PrivateRoute(Home);
