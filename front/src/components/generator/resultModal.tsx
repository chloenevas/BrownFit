import { useState } from "react";

import { auth, database } from "../../index";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import "../../styles/login.css";

/* Gets input values from dropdown menus, visibility variable from workoutPage,
and workoutMap from workout generated in back end*/
export interface InputProps {
  durationValue: string;
  muscleValue: string;
  muscleValue2: string;
  goalValue: string;
  modalVisibility: string;
  setModalVisibility: React.Dispatch<React.SetStateAction<string>>;
  workoutMap: Array<any>;
}

/**
 * Models the pop up page that come up after the generate button is hit
 */
export default function RESULTMODAL({
  durationValue,
  muscleValue,
  muscleValue2,
  goalValue,
  modalVisibility,
  setModalVisibility,
  workoutMap,
}: InputProps) {
  let exerciseList: any[];
  const [saveButtonVis, setSaveButtonVis] = useState("none");
  const [saveSuccessMess, setSaveSuccessMess] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<ExerciseInfo | null>(
    null
  );

  //interace modeling the exercises that make up workouts
  interface ExerciseInfo {
    rating: number;
    exercise: string;
    description: string;
    image: string | null;
    date: Timestamp;
    reps: number | null | string;
    weight: string | null;
  }

  /* Converts the back-end generated workout json ito a useable object
   * then splits that object into two values, one with its name and the other with
   * a concactanated string of image path, instructions, reps, and weight
   */
  exerciseList = workoutMap;
  const map = new Map(
    exerciseList.map((obj) => [
      obj.name,
      obj.img
        ? obj.img + " " + obj.instructions + "W:" + obj.weight + "R:" + obj.reps
        : " " + obj.instructions,
    ])
  );

  // Create Firebase Timestamp object based on current date
  const currentDate: Date = new Date();
  const seconds: number = Math.floor(currentDate.getTime() / 1000);
  const nanoseconds: number = (currentDate.getTime() % 1000) * 1e6;
  const currentTimestamp: Timestamp = new Timestamp(seconds, nanoseconds);

  // Create a list of exercises based on the workouts that got generated
  const newExerciseHistory: ExerciseInfo[] = Array.from(map).map(
    ([key, value]) => {
      return {
        exercise: key,
        rating: 3,
        image: getImg(value),
        description: getInstructions(value),
        date: currentTimestamp,
        reps: getReps(value),
        weight: getWeight(value),
      };
    }
  );

  // constantly check if a user is signed in
  setInterval(() => {
    checkUser();
  }, 100);

  /**
   * Visibly close the modal and reset success message
   */
  function handleCloseClick() {
    setModalVisibility("none");
    setSaveSuccessMess("");
  }

  /**
   * Make call to save the exercises and display a sucess message
   */
  function onSaveClick() {
    if (saveSuccessMess === "") {
      updateExerciseHistory();
      setSaveSuccessMess("Exercises successfully saved to user history!");
    }
  }

  /**
   * Takes in a string containing object image, instructions, reps, and weight
   * and returns just the image path
   *
   * @param val - string containing all exercise info
   * @returns - image path
   */
  function getImg(val: string) {
    let spaceIndex = val.indexOf(" ");
    let imgPath = val.substring(0, spaceIndex);

    return imgPath.includes("/")
      ? "src/components" + val.substring(0, spaceIndex)
      : null;
  }

  /**
   * Takes in a string containing object image, instructions, reps, and weight
   * and returns just the instructions
   *
   * @param val - string containing all exercise info
   * @returns - instructions
   */
  function getInstructions(val: string) {
    let spaceIndex = val.indexOf(" ");
    if (val.includes("W:")) {
      return "Instructions: " + val.substring(spaceIndex, val.indexOf("W:"));
    } else {
      return val.substring(spaceIndex, val.length);
    }
  }

  /**
   * Takes in a string containing object image, instructions, reps, and weight
   * and returns just the weight
   *
   * @param val - string containing all exercise info
   * @returns - weight
   */
  function getWeight(val: string): string {
    if (val.includes("W:")) {
      if (val.includes("R:")) {
        return val.substring(val.indexOf("W:") + 2, val.indexOf("R:"));
      }
    }
    return "";
  }

  /**
   * Takes in a string containing object image, instructions, reps, and weight
   * and returns just the reps
   *
   * @param val - string containing all exercise info
   * @returns - reps
   */
  function getReps(val: string): string {
    if (val.includes("W:")) {
      if (val.includes("R:")) {
        return val.substring(val.indexOf("R:") + 2, val.length);
      }
    }
    return "";
  }

  /**
   * Takes in exercise clicked by user and marks it as the currently selected exercise
   * if it's not already selected, and unmarks it as the currently selected exercise if it
   * is already selected.
   * @param exercise - exercise clicked by user
   */
  const handleExerciseClick = (exercise: ExerciseInfo) => {
    if (selectedExercise?.exercise === exercise.exercise) {
      setSelectedExercise(null);
    } else {
      setSelectedExercise(exercise);
    }
  };

  /**
   * If a user is signed in, give them the option to save the exercies. If no user signed in,
   * they can't save
   */
  async function checkUser() {
    auth.onAuthStateChanged((user) => {
      if (user !== null) {
        setSaveButtonVis("flex");
      } else {
        setSaveButtonVis("none");
      }
    });
  }

  /**
   * Update user's information with their newly generated exercises.
   */
  async function updateExerciseHistory() {
    if (auth.currentUser !== null) {
      const currentUser = auth.currentUser;
      const userID = currentUser?.uid;
      const currentUserDoc = doc(database, "users", userID);

      const docSnapshot = await getDoc(currentUserDoc);
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const userExerciseHist: ExerciseInfo[] = userData.exerciseHistory;

        let historyNames: string[] = []; // create lists for just the names (not the full exercise object)
        let newNames: string[] = [];

        let mergedExerciseData;

        { // add exercise names to historyNames
          Array.from(userExerciseHist).map((item) =>
            historyNames.push(item.exercise)
          );
        }
        { // add exercise names to newNames
          Array.from(newExerciseHistory).map(
            (item) => newNames.push(item.exercise) 
          );
        }

        // if there are duplicate exercises, remove them from new exercise list before they get added to history
        newExerciseHistory.forEach((newExercise: ExerciseInfo, newIndex) => {
          for (
            let oldIndex = 0;
            oldIndex < userExerciseHist.length;
            oldIndex++
          ) {
            if (newExercise.exercise === userExerciseHist[oldIndex].exercise) { // if an exercise from new is in old
              newExerciseHistory.splice(newIndex, 1); // get rid of the exercise from new
            }
          }
        });

        if (Object.keys(userExerciseHist).length == 0) { 

          // If history is empty, just set the history to be the new exercises
          mergedExerciseData = newExerciseHistory;
        } else {
          // If history isn't empty, add on the new exercises to the history
          mergedExerciseData = userExerciseHist.concat(newExerciseHistory);
        }

        // create the new exerciseHistory field for the user's document
        const docData = {
          exerciseHistory: mergedExerciseData,
        };

        if (userID !== undefined) {
          await setDoc(doc(database, "users", userID), docData, { // update the user's document
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

            <div className="horizontal-menu">
              {newExerciseHistory.map(
                (exercise: ExerciseInfo, index: number) => (
                  <button
                    key={index}
                    className={
                      selectedExercise?.exercise === exercise.exercise
                        ? "menu-item active"
                        : "menu-item"
                    }
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    {" "}
                    {exercise.exercise}
                  </button>
                )
              )}
            </div>
            <div
              className="exercise-info"
              style={{
                padding: selectedExercise ? "20px" : "0",
                display: selectedExercise ? "block" : "none",
              }}
            >
              {selectedExercise && selectedExercise.image && (
                <div>
                  <div className="image-container">
                    <img
                      src={selectedExercise.image}
                      alt={`Image for ${selectedExercise.exercise}`}
                      style={{
                        width: "400px",
                        height: "400px",
                      }}
                    />
                  </div>

                  <p>{selectedExercise.description}</p>
                  <p>{"Weight: " + selectedExercise.weight}</p>
                  <p>{"Reps: " + selectedExercise.reps}</p>
                </div>
              )}
              {selectedExercise &&
                !selectedExercise.image &&
                selectedExercise.description && (
                  <p>{selectedExercise.description}</p>
                )}
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
