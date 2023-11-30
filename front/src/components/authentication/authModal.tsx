import { useState } from "react";
import { auth } from "../../index";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../../styles/login.css";
import { ControlledInput } from "../controlledInput";


export default function AUTHMODAL() {
  const [modalVisibility, setModalVisibility] = useState<string>("none");
  const [loginButtonColor, setLoginButtonColor] = useState<string>("#fff0e0");
  const [emailValue, setEmailValue] = useState(""); // State for the input value
  const [passwordValue, setPasswordValue] = useState(""); // State for the input value
  const [signupState, setSignupState] = useState("Enter email and password to sign up"); // State for the input value
  const [optionsPageVisibility, setOptionsPageVisibility] = useState("flex");
  const [loginPageVisibility, setLoginPageVisibility] = useState("none");

  function handleOpenClick() {
    // TODO: call authentication here
    setLoginButtonColor("Red");
    // makes modal appear
    setModalVisibility("flex");
    return undefined;
  }

  function handleCloseClick() {
    setLoginButtonColor("#fff0e0");
    setModalVisibility("none");
    setEmailValue("");
    setPasswordValue("");
    setSignupState("Enter email and password to sign up")
    setOptionsPageVisibility("flex");
    setLoginPageVisibility("none");
    return undefined;
  }

  function handleLoginClick() {
    setOptionsPageVisibility("none")
    setLoginPageVisibility("flex")
  }

  function handleSubmit() {
    // sign up user
    createUserWithEmailAndPassword(auth, emailValue, passwordValue).then(
      (cred) => {
        console.log(cred.user);
        setSignupState("Success!");
      }
    )
      .catch((err) => {
        console.log(err.code)
        if (err.code == "auth/weak-password") {
          setSignupState("Password must be at least 6 characters.");
        } else if (err.code == "auth/email-already-in-use") {
          setSignupState("Email already in use. Please sign in.");
        } else if (err.code == "auth/invalid-email") {
          setSignupState("Please enter a valid email.");
        }
      });
  }

  return (
    <div>
      <p className="App-header">
        <button
          className="App-header-login"
          aria-label="login button"
          style={{ backgroundColor: loginButtonColor }}
          onClick={() => handleOpenClick()}
        >
          Login/Sign up
        </button>

        <h1 className="App-header-title">BrownFit</h1>
      </p>
      <div className="modal" style={{ display: modalVisibility }}>
        <span className="close-button" onClick={() => handleCloseClick()}>
          &times;
        </span>
        <div className="modal-content">
          <div style={{ display: optionsPageVisibility }}>
            <button className="login-button" onClick={() => handleLoginClick()}>
              Login
            </button>
            <button className="signup-button">Sign up</button>
          </div>
          <div>
            <fieldset
              style={{ display: loginPageVisibility }}
              className="input"
            >
              <legend>Email:</legend>
              <ControlledInput
                value={emailValue}
                setValue={setEmailValue}
                ariaLabel={"email input box"}
              />
              <legend>Password:</legend>
              <ControlledInput
                value={passwordValue}
                setValue={setPasswordValue}
                ariaLabel={"password input box"}
              />
            </fieldset>
            <div>
              <button
                type="submit"
                style={{ display: loginPageVisibility }}
                className="submitButton"
                aria-label={"submit button"}
                onClick={() => handleSubmit()}
              >
                Sign up
              </button>
            </div>
            <p style={{ marginTop: "35px", display: loginPageVisibility }}>{signupState}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
