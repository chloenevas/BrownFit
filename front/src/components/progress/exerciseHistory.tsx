import { useState, SetStateAction, useEffect } from "react";
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
import { getUA } from "@firebase/util";

export default function ExerciseHistory() {
 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editVisibility, setEditVisibility] = useState("none");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
const [exerciseHistNames, setExerciseHistNames] = useState<string[]>([]);

  

  interface ExerciseInfo {
    rating: number;
    exercise: string;
    description: string;
    image: string;
  }
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseInfo[]>([]);

  function setupPage() {
if (auth.currentUser !== null) {
  const currentUser = auth.currentUser;
  const userID = currentUser?.uid;

  if (userID === undefined) {
    setFirstName("");
    setLastName("");
  } else {
    const currentUserDoc = doc(database, "users", userID); // get document of current logged in user
    console.log(userID)
    const getUserData = async () => {
      try {
        const docSnapshot = await getDoc(currentUserDoc);
        if (docSnapshot.exists()) {
          // check to see if the doc exists
          const userData = docSnapshot.data();
          const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history
          setExerciseHistory(exerciseList);
          const names = exerciseList.map((item) => item.exercise);
          
          setExerciseHistNames(names); // set exercise history to be those names
        }
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }
}
  }
    
  
   useEffect(() => {
     setupPage();
   }, []);
  

  function handleEditButton() {
    setEditVisibility("flex");
  }

  function handleDeleteExercise(index: number) {
    // console.log(exerciseHistNames)
    // const newHist = exerciseHistNames.splice(index, 1);
    // console.log(newHist)
    // setExerciseHistNames(newHist)

    if (auth.currentUser !== null) {
      const currentUser = auth.currentUser;
      const userID = currentUser?.uid;
      const currentUserDoc = doc(database, "users", userID); // get document of current logged in user
      const deleteExercise = async () => {
        try {

          const docSnapshot = await getDoc(currentUserDoc);

          if (docSnapshot.exists()) {

            // check to see if the doc exists
            const userData = docSnapshot.data();

            const exerciseList: ExerciseInfo[] = userData.exerciseHistory // get user's current exercise history

            //    setExerciseHistory(exerciseList); 
            let names: string[] = [] // create empty array for storing exercise names
            let newHistory: ExerciseInfo[] = []

            for (let itemIndex = 0; itemIndex < exerciseList.length; itemIndex++) {
              if (exerciseHistNames[index] === exerciseList[itemIndex].exercise) {
                exerciseList.splice(itemIndex, 1);
                itemIndex--;
              }
            }

            setExerciseHistNames(exerciseList.map((item) => item.exercise));


            const docData = {
              exerciseHistory: exerciseList,
            };

            if (userID !== undefined) {
              await setDoc(doc(database, "users", userID), docData, {
                merge: true,
              });
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      deleteExercise();
    }

  }
  return (
    <div className="progress-page">
      <div className="content">
        <p style={{ fontSize: "larger", fontWeight: "bold" }}>
          Exercise History:
        </p>
        <ul>
          {exerciseHistNames.map((item, index) => (
            <div className="exercise-pair" key={index}>
              <p className="exercise">{item}</p>
              <span
                className="delete-button"
                onClick={() => handleDeleteExercise(index)}
              >
                &times;
              </span>
            </div>
          ))}
        </ul>
        <button>
          Add exercise
        </button>
      </div>
    </div>
  );
}
