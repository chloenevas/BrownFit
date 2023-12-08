import { useState, SetStateAction } from "react";
import { ControlledInput } from "../ControlledInput";
import "../../styles/progress.css";
import { auth, database, collectionRef, users } from "../../index";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
  query,
  where,
  setDoc,
} from "firebase/firestore";

export default function ExerciseHistory() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [editVisibility, setEditVisibility] = useState("none");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");



  interface ExerciseInfo {
    rating: number;
    exercise: string;
    description: string;
    image: string;
  }
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseInfo[]>([]);



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
          const exerciseList: ExerciseInfo[] = userData.exerciseHistory.exerciseHistory;
              setExerciseHistory(exerciseList);
              
            }
          } catch (error) {
            console.error("handle error");
          }
        };
        getUserData();
      }
    }
  

  function handleEditButton() {
    setEditVisibility("flex");
    console.log(editVisibility);
  }

  function handleCloseClick() {
    setEditVisibility("none");
    console.log("hey");
    return undefined;
  }

  async function handleSaveClick() {
    if (auth.currentUser !== null) {
      const currentUser = auth.currentUser;
      const userID = currentUser?.uid;

      const docData = {
        firstName: newFirstName,
        lastName: newLastName,
        email: currentUser.email,
      };

      if (userID !== undefined) {
        await setDoc(doc(database, "users", userID), docData);
      }
    }
    setEditVisibility("none");
  }

  return (
    <div className="progress-page">
      <div className="content">
        <p style={{ fontSize: "larger", fontWeight: "bold" }}>
          Exercise History:
        </p>
        {Array.from(exerciseHistory).map((item) => (
          <ul>
              {item.exercise}
          </ul>
        ))}
      </div>
    </div>
  );
}
