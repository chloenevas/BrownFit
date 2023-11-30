import { useState } from "react";
import { ControlledInput } from "../ControlledInput";
import { auth } from "../../index";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../../styles/login.css";


export default function LOGINMODAL() {
  const [modalVisibility, setModalVisibility] = useState<string>("none");
  const [loginButtonColor, setLoginButtonColor] = useState<string>("#fff0e0");
  const [emailValue, setEmailValue] = useState(""); // State for the input value
  const [passwordValue, setPasswordValue] = useState(""); // State for the input value

  function handleLoginButtonClick() {
    // TODO: call authentication here
    setLoginButtonColor("Red");
    // makes modal appear
    setModalVisibility("flex");
    return undefined;
  }

  function handleCloseLoginClick() {
    setLoginButtonColor("#fff0e0");
    setModalVisibility("none");
    return undefined;
  }

  function handleSubmit() {
    console.log(emailValue);
    console.log(passwordValue);
    console.log(auth)
    // sign up user
    createUserWithEmailAndPassword(auth, emailValue, passwordValue).then(
      (cred) => {
        console.log(cred.user);
        handleCloseLoginClick();
      }
    );
  }

  return (
    <div>
      <p className="App-header">
        <button
          className="App-header-login"
          aria-label="login button"
          style={{ backgroundColor: loginButtonColor }}
          onClick={() => handleLoginButtonClick()}
        >
          Sign up
        </button>

        <h1 className="App-header-title">BrownFit</h1>
      </p>
      <div className="modal" style={{ display: modalVisibility }}>
        <span className="close-button" onClick={() => handleCloseLoginClick()}>
          &times;
        </span>
        <div className="modal-content">
          <fieldset className="input">
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
              className="submitButton"
              aria-label={"submit button"}
              onClick={() => handleSubmit()}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
