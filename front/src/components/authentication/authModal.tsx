import { useState } from "react";
import { auth, database } from "../../index";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

import "../../styles/login.css";
import { ControlledInput } from "../ControlledInput";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

export default function AUTHMODAL() {
  const [modalVisibility, setModalVisibility] = useState<string>("none");
  const [loginButtonColor, setLoginButtonColor] = useState<string>("#fff0e0");
  const [emailValue, setEmailValue] = useState(""); // State for the input value
  const [passwordValue, setPasswordValue] = useState(""); // State for the input value
  const [authState, setAuthState] = useState(""); // State for the input value
  const [optionsPageVisibility, setOptionsPageVisibility] = useState("flex");
  const [loginPageVisibility, setLoginPageVisibility] = useState("none");
  const [submitButtonText, setSubmitButtonText] = useState("");
  const [signinSignoutButton, setSigninSignoutButton] =
    useState("Login/Sign up");
  const [currentUser, setCurrentUser] = useState<string | null>("");
  const [enterNameVisibility, setEnterNameVisibility] = useState("none");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  /**
   * Handles click on login/sign up or logout button
   * If user is currently signed in --> sign out and set button back to login/sign up
   * If no user is signed in --> open the sign up/login modal
   * @param loginStatus - whether or not a user is currently signed in
   */
  function handleSigninSignoutClick(loginStatus: string) {
    if (loginStatus === "Logout") {
      // if a user is signed in and wants to log out
      signOut(auth).then(() => {
        setSigninSignoutButton("Login/Sign up");
        setCurrentUser("");
      });
    } else {
      // user is logged out and they click to sign up
      setLoginButtonColor("Red");
      setModalVisibility("flex");
    }
  }

  /**
   * Closes the login/sign up modal and resets all values
   */
  function handleCloseClick() {
    setLoginButtonColor("#fff0e0");
    setModalVisibility("none");
    setEmailValue("");
    setPasswordValue("");
    setAuthState("Enter email and password to sign up");
    setOptionsPageVisibility("flex");
    setLoginPageVisibility("none");
  }

  /**
   * Resets input fields and changes text to apply to login
   */
  function handleLoginClick() {
    setEnterNameVisibility("none");
    setOptionsPageVisibility("none");
    setLoginPageVisibility("block");
    setSubmitButtonText("Login");
    setAuthState("Enter email and password to login");
  }

  /**
   * Resets input fields and changes text to apply to sign up
   */
  function handleSignupClick() {
    setEnterNameVisibility("block");
    setOptionsPageVisibility("none");
    setLoginPageVisibility("block");
    setSubmitButtonText("Sign up");
    setAuthState("Enter email and password to sign up");
  }

  /**
   * Depending on what the user chooses, this function carries out the authentication 
   * to sign a user up or log them in. If they're signing up for the first time, it creates
   * a document for them in the database connected to their user ID.
   * 
   * @param submitType - Sign up or login, depending on what the user chooses
   */
  function handleSubmit(submitType: string) {
    if (submitType === "Sign up") { 

      // Set persistance so that once browser is closed, user is no longer signed in
      setPersistence(auth, browserSessionPersistence).then(() => {

        // Sign user up with entered inputs
        createUserWithEmailAndPassword(auth, emailValue, passwordValue)
          .then((cred) => {
            setAuthState("Success!");
            setSigninSignoutButton("Logout");
            const userCred = cred.user;
            const userEmail = userCred.email;
            setCurrentUser(userEmail);
            const userID = userCred.uid;

            // create a doc for that user within the database
            setDoc(doc(database, "users", userID), {
              email: userEmail,
              firstName: firstName,
              lastName: lastName,
              exerciseHistory: {
                 rating: Number,
                exercise: String,
                description: String,
                image: null,
                date: Timestamp,
                reps: null,
                weight: null
              },
            });
          })

          // catch possible errors with user inputs in regards to sign up
          .catch((err) => {
            if (err.code == "auth/weak-password") {
              setAuthState("Password must be at least 6 characters.");
            } else if (err.code == "auth/email-already-in-use") {
              setAuthState("Email already in use. Please sign in.");
            } else if (err.code == "auth/invalid-email") {
              setAuthState("Please enter a valid email.");
            }
          });
      });
    } else if (submitType === "Login") {

      // Set persistance so that once browser is closed, user is no longer signed in
      setPersistence(auth, browserSessionPersistence).then(() => {

        // Sign user in with entered inputs
        signInWithEmailAndPassword(auth, emailValue, passwordValue)
          .then((cred) => {
            setAuthState("Success!");
            setSigninSignoutButton("Logout");
            const user = auth.currentUser;
            if (user !== null) {
              const userEmail = user.email;
              setCurrentUser(userEmail);
            }
          })

          // catch possible errors with user inputs in regards to login
          .catch((err) => {
            if (err.code == "auth/invalid-credential") {
              setAuthState("Invalid email or password. Please try again.");
            } else if (err.code == "auth/invalid-email") {
              setAuthState("Please enter a valid email.");
            } else if ((err.code = "auth/missing-password")) {
              setAuthState("Please enter a password.");
            }
          });
      });
    }
  }

  return (
    <div>
      {modalVisibility === "flex" && <div className="overlay"></div>}
      <p className="App-header">
        <button // signup/login/sign out button
          className="App-header-login"
          aria-label="login button"
          style={{ backgroundColor: loginButtonColor }}
          onClick={() => handleSigninSignoutClick(signinSignoutButton)}
        >
          {signinSignoutButton}
        </button>
        <p className="current-user">{currentUser}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100px",
            height: "100px",
            border: "2px solid red",
            backgroundColor: "#fff",
          }}
        >
          <img
            src={"src/components/B.png"}
            alt="BrownFit Logo"
            style={{
              width: "50px",
              height: "50px",
            }}
          />
        </div>
        <h1 className="App-header-title">BrownFit</h1>
      </p>

      {/* Popup for when a user clicks login/sign up */}
      <div className="modal" style={{ display: modalVisibility }}>
        <span className="close-button" onClick={() => handleCloseClick()}>
          &times;
        </span>
        <div className="modal-content">
          <div style={{ display: optionsPageVisibility }}>
            <button className="login-button" onClick={() => handleLoginClick()}>
              Login
            </button>
            <button
              className="signup-button"
              onClick={() => handleSignupClick()}
            >
              Sign up
            </button>
          </div>
          {/* Login/sign up page */}
          <div style={{ display: loginPageVisibility }}>
            <fieldset className="input">
              <div className="input-label">
                <div style={{ display: enterNameVisibility }}>
                  {/* First and last name fields only appear if it's sign up */}
                  <legend>First Name:</legend>
                  <ControlledInput
                    type="text"
                    value={firstName}
                    setValue={setFirstName}
                    ariaLabel={"first name input box"}
                    className="email-input"
                  />
                  <legend>Last Name:</legend>
                  <ControlledInput
                    type="text"
                    value={lastName}
                    setValue={setLastName}
                    ariaLabel={"last name input box"}
                    className="password-input"
                  />
                </div>
                <legend>Email:</legend>
                <ControlledInput
                  type="text"
                  value={emailValue}
                  setValue={setEmailValue}
                  ariaLabel={"email input box"}
                  className="email-input" // Add a class name for the email input
                />
              </div>
              <div className="input-label">
                <legend>Password:</legend>
                <ControlledInput
                  type="password"
                  value={passwordValue}
                  setValue={setPasswordValue}
                  ariaLabel={"password input box"}
                  className="password-input" // Add a class name for the password input
                />
              </div>
            </fieldset>
            <button
              type="submit"
              className="submitButton"
              aria-label={"submit button"}
              onClick={() => handleSubmit(submitButtonText)}
            >
              {submitButtonText}
            </button>
            <p style={{ marginTop: "35px" }}>{authState}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
