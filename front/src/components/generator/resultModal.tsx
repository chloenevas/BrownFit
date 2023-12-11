import { mock } from "node:test";
import { useState } from "react";
import abCrunch from "../nelsonMachines/abCrunch.png";
import treadmill from "../nelsonMachines/treadmill.png";
import legPress from "../nelsonMachines/legPress.png";

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
  FieldValue,
} from "firebase/firestore";
import "../../styles/login.css";
//import {BrownLogo} from "../

export interface InputProps {
  durationValue: string;
  muscleValue: string;
  muscleValue2: string;
  goalValue: string;
  modalVisibility: string;
  setModalVisibility: React.Dispatch<React.SetStateAction<string>>;
  workoutMap: Array<any>;
}

export default function RESULTMODAL({
  durationValue,
  muscleValue,
  muscleValue2,
  goalValue,
  modalVisibility,
  setModalVisibility,
  workoutMap,
}: InputProps) {
  //TODO: make call to backend and retrieve json with exercises
  // Go through json and extract name, image, and instructions for each exercise
  // add each to a list? map? tbd doesn't really matter

  let exerciseList: any[];
  const [infoVisibility, setInfoVisibility] = useState("none"); // State for the input value
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [saveButtonVis, setSaveButtonVis] = useState("none");
  const [saveSuccessMess, setSaveSuccessMess] = useState("");

  interface ExerciseInfo {
    rating: number;
    exercise: string;
    description: string;
    image: string;
    weight: string;
    reps: string;
  }

  let showImg = "none";

  //here, exeriseList correctly reads in the back end workout generated.
  //just need to figure out how to display it
  exerciseList = workoutMap;
  const map = new Map(
    exerciseList.map((obj) => [
      obj.name,
      obj.img
        ? obj.img + " " + obj.instructions + "W:" + obj.weight + "R:" + obj.reps
        : " " + obj.instructions,
    ])
  );

  const newExerciseHistory: ExerciseInfo[] = Array.from(map).map(
    ([key, value]) => {
      return {
        exercise: key,
        rating: 0,
        image: getImg(value),
        description: getInstructions(value),
      };
    }
  );

  setInterval(() => {
    checkUser();
  }, 100);

  function handleCloseClick() {
    setModalVisibility("none");
    setSaveSuccessMess("");

    return undefined;
  }

  function onSaveClick() {
    if (saveSuccessMess === "") {
      console.log("saving exercises");
      updateExerciseHistory();
      setSaveSuccessMess("Exercises successfully saved to user history!");
    }
  }

  function getImg(val: string) {
    let spaceIndex = val.indexOf(" ");
    let imgPath = val.substring(0, spaceIndex);
    if (imgPath.includes("/")) {
      showImg = "block";
    } else {
      showImg = "none";
    }
    return "src/components" + val.substring(0, spaceIndex);
  }

  function getInstructions(val: string) {
    let spaceIndex = val.indexOf(" ");
    if (val.includes("W:")) {
      return "Instructions: " + val.substring(spaceIndex, val.indexOf("W:"));
    } else {
      return val.substring(spaceIndex, val.length);
    }
  }

  function getWeight(val: string) {
    if (val.includes("W:")) {
      if (val.includes("R:")) {
        return val.substring(val.indexOf("W:") + 2, val.indexOf("R:"));
      }
    } else {
      return "";
    }
  }

  function getReps(val: string) {
    if (val.includes("W:")) {
      if (val.includes("R:")) {
        return val.substring(val.indexOf("R:") + 2, val.length);
      }
    } else {
      return "";
    }
  }

  const handleExerciseClick = (key: string) => {
    setInfoVisibility("flex");
    if (clickedItem === key) {
      setClickedItem(null);
      setInfoVisibility("none");
    } else {
      setClickedItem(key);
    }
  };

  async function checkUser() {
    auth.onAuthStateChanged((user) => {
      if (user !== null) {
        setSaveButtonVis("flex");
      } else {
        setSaveButtonVis("none");
      }
    });
  }

  async function updateExerciseHistory() {
    if (auth.currentUser !== null) {
      const currentUser = auth.currentUser;
      const userID = currentUser?.uid;
      const currentUserDoc = doc(database, "users", userID);

      const docSnapshot = await getDoc(currentUserDoc);
      if (docSnapshot.exists()) {
        // check to see if the doc exists
        const userData = docSnapshot.data();
        const userExerciseHist: ExerciseInfo[] = userData.exerciseHistory;
        let historyNames: string[] = [];
        let newNames: string[] = [];

        let mergedExerciseData;

        {
          Array.from(userExerciseHist).map(
            (item) => historyNames.push(item.exercise) // add every name
          );
        }
        {
          Array.from(newExerciseHistory).map(
            (item) => newNames.push(item.exercise) // add every name
          );
        }

        // if there are duplicate exercises, remove them from new exercise list before they get added to history
        newExerciseHistory.forEach((newExercise: ExerciseInfo, newIndex) => {
          userExerciseHist.forEach((oldExercise: ExerciseInfo, oldIndex) => {
            if (newExercise.exercise === oldExercise.exercise) {
              newExerciseHistory.splice(newIndex, 1);
            }
          });
        });

        if (Object.keys(userExerciseHist).length == 0) {
          // check that the history isn't empty

          mergedExerciseData = newExerciseHistory;
        } else {
          mergedExerciseData = userExerciseHist.concat(newExerciseHistory);
        }

        const docData = {
          exerciseHistory: mergedExerciseData,
        };

        if (userID !== undefined) {
          await setDoc(doc(database, "users", userID), docData, {
            merge: true,
          });
        }
      }
    }
  }

  {
    return (
      <div>
        <div className="workout-modal" style={{ display: modalVisibility }}>
          <span className="close-button" onClick={() => handleCloseClick()}>
            &times;
          </span>
          <div className="modal-content">
            <div className="header-workout">
              <p>
                <span style={{ fontWeight: "bold" }}>
                  {muscleValue.charAt(0).toUpperCase() +
                    muscleValue.slice(1).toLowerCase()}
                </span>{" "}
                {muscleValue2 && (
                  <>
                    <span style={{ fontWeight: "bold" }}>and</span>{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {muscleValue2.charAt(0).toUpperCase() +
                        muscleValue2.slice(1).toLowerCase()}
                    </span>
                  </>
                )}
              </p>
              <p>Duration: {durationValue}</p>
              <p>Goal: {goalValue}</p>
            </div>

            <p>Click any exercise to view more info</p>
            <div>
              {Array.from(map).map(([key, value]) => (
                <div key={key}>
                  <p
                    className="hover-area"
                    onClick={() => handleExerciseClick(key)}
                  >
                    {key}
                  </p>
                  {clickedItem === key && (
                    <div>
                      <img
                        src={getImg(value)}
                        alt={`Image for ${key}`}
                        style={{
                          width: "400px", // Adjust the width of the image as needed
                          height: "400px", // Adjust the height of the image as needed
                          display: showImg,
                        }}
                      />
                      <p>{getInstructions(value)}</p>
                      <p style={{ display: showImg }}>
                        {"Weight: " + getWeight(value)}
                      </p>
                      <p style={{ display: showImg }}>
                        {"Reps: " + getReps(value)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div>
              <button
                style={{ display: saveButtonVis }}
                onClick={() => onSaveClick()}
              >
                Save exercises
              </button>
              <p>{saveSuccessMess}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
