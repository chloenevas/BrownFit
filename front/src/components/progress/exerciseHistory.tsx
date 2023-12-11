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

const handleRatingChange =
  (index: number) => (event: React.ChangeEvent<{ value: string }>) => {
    const rating = parseInt(event.target.value);
    if (auth.currentUser !== null) {
      const currentUser = auth.currentUser;
      const userID = currentUser?.uid;
      const currentUserDoc = doc(database, "users", userID); // get document of current logged in user
      const changeRating = async () => {
        try {
          const docSnapshot = await getDoc(currentUserDoc);

          if (docSnapshot.exists()) {
            // check to see if the doc exists
            const userData = docSnapshot.data();
            const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history
            const exerciseListCopy = [...exerciseList]
            exerciseListCopy[index].rating = rating;
             // exerciseList[index]
            const docData = {
              exerciseHistory: exerciseListCopy,
            };

            
            if (userID !== undefined) {
              // set the exercise list with updated ratings
              await setDoc(doc(database, "users", userID), docData, {
                merge: true,
              });
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      changeRating();
    }
  };

  function handleDeleteExercise(index: number) {

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

            for (let itemIndex = 0; itemIndex < exerciseList.length; itemIndex++) {
              if (exerciseHistNames[index] === exerciseList[itemIndex].exercise) {
                exerciseList.splice(itemIndex, 1);
                itemIndex--;
              }
            }

            setExerciseHistNames(exerciseList.map((item) => item.exercise)); // extract exercise names from list

            const docData = {
              exerciseHistory: exerciseList,
            };

            if (userID !== undefined) { // set the new  exercies list
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
              <span
                className="delete-button"
                onClick={() => handleDeleteExercise(index)}
              >
                &times;
              </span>
              <p className="exercise">{item}</p>

              <label className="rating-dropdown">
                Rating
                <select className="selector" onChange={handleRatingChange(index)}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
            </div>
          ))}
        </ul>
        <button>Add exercise</button>
      </div>
    </div>
  );
}
