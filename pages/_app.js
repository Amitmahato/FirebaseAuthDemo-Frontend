import { useEffect, createContext, useState } from "react";
import firebase from "../firebase";

const AuthContext = createContext();

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "96vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Component {...pageProps} />
      </div>
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default MyApp;
