
import { useState } from "react";
import { ControlledInput } from "../ControlledInput";
import "../../styles/progress.css";
import { auth, database, collectionRef, users} from "../../index";
import {
  collection, addDoc, updateDoc, doc, onSnapshot,
query, where} from "firebase/firestore";


export default function ProgressPage() {
  const [firstName, setFirstName] = useState(""); 
  const [lastName, setLastName] = useState(""); 
  let userList: { id: string }[] = [];



  
  function handleSaveClick() {
   const docRef = doc(database, 'users', 'firstname')

  }

  const q = query(collectionRef, where("email", "==", "chloe_nevas@brown.edu"))

  return (
    <div>
      <p>Account Information</p>

      <legend>First Name:</legend>

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
      <button onClick={() => handleSaveClick()}>Save</button>
    </div>
  );
}
