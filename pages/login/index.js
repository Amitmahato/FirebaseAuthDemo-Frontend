import React, { useContext, useState } from "react";
import { Formik, useField } from "formik";
import * as Yup from "yup";
import firebase from "../../firebase";
import axios from "axios";
import { AuthContext } from "../_app";
import { useRouter } from "next/router";

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <div>
        <input style={{ width: "90%", height: 20 }} {...field} {...props} />
        {meta.touched && meta.error ? (
          <div style={{ color: "red" }}>
            <small>{meta.error}</small>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Login = () => {
  const [signUp, setSignUp] = useState(false);
  const { loading, setLoading } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = async (values) => {
    setLoading(true);
    if (signUp) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((result) => {
          if (result?.additionalUserInfo.isNewUser) {
            axios
              .post("/api/signup", {
                user_firstName: values.firstName,
                user_lastName: values.lastName,
                user_email: values.email,
                user_phone: values.phone,
                user_UID: result.user.uid,
              })
              .catch((error) => {
                console.log("Error registering user : ", error);
              });
          }
          router.push("/");
        })
        .catch((error) => {
          console.log("Error : ", error.message);
        });
    } else {
      await firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.log("Error : ", error.message);
        });
    }
    setLoading(false);
  };

  const handleSignInWithGoogle = () => {
    setLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        if (result?.additionalUserInfo.isNewUser) {
          axios
            .post("/api/signup", {
              user_firstName: result.additionalUserInfo.profile.given_name,
              user_lastName: result.additionalUserInfo.profile.family_name,
              user_email: result.additionalUserInfo.profile.email,
              user_phone: result.user.phoneNumber,
              user_UID: result.user.uid,
            })
            .catch((error) => {
              console.log("Error registering user : ", error);
            });
        }
        router.push("/");
      })
      .catch((error) => {
        console.log("Error : ", error.message);
      });
    setLoading(false);
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div
      style={{
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "gray",
        height: signUp ? "550px" : "250px",
        width: "400px",
        boxShadow: "2px 2px 500px 50px #eee",
      }}
    >
      <Formik
        initialValues={
          signUp
            ? {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
              }
            : {
                email: "",
                password: "",
              }
        }
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid Email Address")
            .required("Required"),
          password: Yup.string().required("Required"),
          ...(signUp
            ? {
                firstName: Yup.string()
                  .required("Required")
                  .max(15, "Firstname can be atmost 15 character long"),
                lastName: Yup.string()
                  .required("Required")
                  .max(15, "Lastname can be atmost 15 character long"),
                phone: Yup.string().length(
                  10,
                  "Phone number must be 10 character long"
                ),
                confirmPassword: Yup.string()
                  .required("Required")
                  .oneOf([Yup.ref("password"), null], "Passwords must match"),
              }
            : {}),
        })}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <form
              onSubmit={formik.handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                height: "100%",
                width: "100%",
                padding: "0px 15px",
              }}
            >
              {signUp && (
                <MyTextInput
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                />
              )}

              {signUp && (
                <MyTextInput
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                />
              )}

              {signUp && (
                <MyTextInput
                  label="Phone Number"
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                />
              )}

              <MyTextInput
                label="Email Address"
                name="email"
                type="text"
                placeholder="Enter your email address"
              />

              <MyTextInput
                label="Password"
                name="password"
                type="text"
                placeholder="Enter your password"
              />

              {signUp && (
                <MyTextInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="text"
                  placeholder="Enter your password"
                />
              )}

              <div
                style={{
                  width: "92%",
                  alignSelf: "flex-start",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <button
                    htmlType="submit"
                    type="primary"
                    style={{ cursor: "pointer" }}
                  >
                    {signUp ? "Sign Up" : "Login"}
                  </button>
                  <div style={{ alignSelf: "flex-start" }}>
                    {signUp ? (
                      <div>
                        <small>
                          Already have a account?{" "}
                          <span
                            onClick={() => setSignUp(false)}
                            component="span"
                            style={{ cursor: "pointer" }}
                          >
                            Login instead
                          </span>
                        </small>
                      </div>
                    ) : (
                      <div>
                        <small>
                          New Here ?{" "}
                          <span
                            onClick={() => setSignUp(true)}
                            component="span"
                            style={{ cursor: "pointer" }}
                          >
                            Register Instead
                          </span>
                        </small>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleSignInWithGoogle}
                    style={{ cursor: "pointer" }}
                  >
                    Sign {signUp ? "Up" : "In"} With Google
                  </button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
export default Login;
