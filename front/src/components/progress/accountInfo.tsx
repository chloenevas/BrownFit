import { useEffect, useState } from "react";
import { ControlledInput } from "../ControlledInput";
import "../../styles/progress.css";
import { auth, database } from "../../index";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Displays user account info and allows them to edit their name
 * 
 * @returns - jsx component for account info
 */
export default function AccountInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [editVisibility, setEditVisibility] = useState("none");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");

  /**
   * Get the user's account info (first and last name and email) and
   * set the corresponding states
   */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userID = currentUser.uid;
          const currentUserDoc = doc(database, "users", userID);
          const docSnapshot = await getDoc(currentUserDoc);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setEmail(userData.email || "");
          } else {
            setFirstName("");
            setLastName("");
            setEmail("");
          }
        }
      } catch (error) {
        setFirstName("User unavailable");
        setLastName("User unavailable");
        setEmail("User unavailable");
      }
    };

    fetchUserData();
  }, []); // only fetch data once upon page opening, otherwise will reach Firebase quota for reads

  /**
   * Save user entered data to their database
   */
  async function handleSaveClick() {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userID = currentUser.uid;
        const docData = {
          firstName: newFirstName,
          lastName: newLastName,
          email: currentUser.email,
        };

        if (userID) {
           await setDoc(doc(database, "users", userID), docData, {
             merge: true,
           });
          // Update state with new values
          setFirstName(newFirstName);
          setLastName(newLastName);
          // No need to update email as it's not changed
        }
      }
    } catch (error) {
      setFirstName("Error updating info")
      setLastName("Error updating info");
    }

    setEditVisibility("none");
  }

  /**
   * Make edit popup appear
   */
  function handleEditButton() {
    setEditVisibility("flex");
  }

  /**
   * Close edit popup
   */
  function handleCloseClick() {
    setEditVisibility("none");
  }

  return (
    <div className="progress-page">
      <div className="account-info-display">
        <p style={{ fontSize: "larger", fontWeight: "bold" }}>
          Account Information
        </p>
        <p>
          Name: {firstName} {lastName}
        </p>
        <p>Email: {email} </p>
        <button onClick={handleEditButton}>Edit</button>
      </div>

      <div className="edit-modal" style={{ display: editVisibility }}>
        <span className="close-button" onClick={handleCloseClick}>
          &times;
        </span>
        <div>
          <legend>First Name: </legend>
          <ControlledInput
            type="text"
            value={newFirstName}
            setValue={setNewFirstName}
            ariaLabel={"first name input box"}
            className="account-info-input"
          />
          <legend>Last Name:</legend>

          <ControlledInput
            type="text"
            value={newLastName}
            setValue={setNewLastName}
            ariaLabel={"last name input box"}
            className="account-info-input"
          />

          <button onClick={handleSaveClick}>Save</button>
        </div>
      </div>
    </div>
  );
}
