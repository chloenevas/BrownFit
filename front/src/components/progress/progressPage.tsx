
import { useState } from "react";
import { ControlledInput } from "../ControlledInput";
import "../../styles/progress.css";
import { auth, database, collectionRef, users} from "../../index";
import {
  collection, addDoc, updateDoc, doc, onSnapshot, getDoc,
query, where} from "firebase/firestore";


export default function ProgressPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

  let userList: { id: string }[] = [];

  function handleSaveClick() {
    const docRef = doc(database, "users", "firstname");
  }

  if (auth.currentUser !== null) {
const currentUser = auth.currentUser;
const userID = currentUser?.uid;

if (userID === undefined) {
  setFirstName("");
  setLastName("");
} else {
  const currentUserDoc = doc(database, "users", userID);

  const getUserData = async () => {
    try {
      const docSnapshot = await getDoc(currentUserDoc);
      if (docSnapshot.exists()) {
        // check to see if the doc exists
        const userData = docSnapshot.data();
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
      } else {
        setFirstName("");
        setLastName("");
        setEmail("");
      }
    } catch (error) {
      console.error("handle error");
    }
  };
  getUserData();
}
  }
  
  

  return (
    <div>
      <p>Account Information</p>
      <p>Name: {firstName} {lastName} </p>
      <p>Email: {email} </p>
      {/* <legend>First Name: </legend>
      
      <ControlledInput
        type="text"
        value={firstName}
        setValue={setFirstName}
        ariaLabel={"first name input box"}
        className="account-info-input"
      />
      <legend>Last Name:</legend>

      <ControlledInput
        type="text"
        value={lastName}
        setValue={setLastName}
        ariaLabel={"last name input box"}
        className="account-info-input"
      />
      <button onClick={() => handleSaveClick()}>Save</button> */}
    </div>
  );
}
