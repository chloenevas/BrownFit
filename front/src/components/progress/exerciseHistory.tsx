import { useState, useEffect } from "react";
import "../../styles/progress.css";
import { auth, database } from "../../index";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { it } from "node:test";

export default function ExerciseHistory() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addModalVisibility, setAddModalVisibility] = useState("none");
  const [exerciseInfoVisibility, setExerciseInfoVisibility] = useState("none");
  const [currentExercise, setCurrentExercise] = useState("");
  const [currentRating, setCurrentRating] = useState<number>();
  // useEffect(() => {
  //   if (lastSelectedRating) {
  //     setCurrentRating(lastSelectedRating);
  //   } else {
  //     setCurrentRating(0); // Set a default option if no previously selected option is available
  //   }
  // }, []);
  const [currentReps, setCurrentReps] = useState<number | string | null>();
  const [currentWeight, setCurrentWeight] = useState<number | string | null>();
  const [currentDate, setCurrentDate] = useState<Date | null>();
  const [lastSelectedRating, setLastSelectedRating] = useState<number>();

  const [successMess, setSuccessMess] = useState("");

  const [exerciseHistNames, setExerciseHistNames] = useState<string[]>([]);

  interface ExerciseInfo {
    rating: number;
    exercise: string;
    description: string;
    image: string;
    date: Timestamp;
    reps: number | null;
    weight: number | null;
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
        console.log(userID);
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

  function openAddExercise() {
    setAddModalVisibility("flex");
  }

  function closeAddExercise() {
    setAddModalVisibility("none");
    setSuccessMess("");
  }

  function closeInfoPopup() {
    setExerciseInfoVisibility("none");
    setSuccessMess("");
  }

  function openInfoPopup(currentEx: string) {
    if (auth.currentUser !== null) {
      const currentUser = auth.currentUser;
      const userID = currentUser?.uid;

      if (userID === undefined) {
        setFirstName("");
        setLastName("");
      } else {
        const currentUserDoc = doc(database, "users", userID); // get document of current logged in user
        console.log(userID);
        const getCurrentData = async () => {
          try {
            const docSnapshot = await getDoc(currentUserDoc);
            if (docSnapshot.exists()) {
              // check to see if the doc exists
              const userData = docSnapshot.data();
              const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history
              for (
                let itemIndex = 0;
                itemIndex < exerciseList.length;
                itemIndex++
              ) {
                for (let i = 0; i < exerciseList.length; i++) {
                  if (currentEx === exerciseList[i].exercise) {
                    setCurrentExercise(currentEx);
                    const seconds = exerciseList[i].date.seconds;
                    setCurrentDate(new Date(seconds * 1000));

                    if (exerciseList[i].reps === null) {
                      setCurrentReps("N/A");
                    } else {
                      setCurrentReps(exerciseList[i].reps);
                    }

                    if (exerciseList[i].weight === null) {
                      setCurrentWeight("N/A");
                    } else {
                      setCurrentWeight(exerciseList[i].weight);
                    }

                    setCurrentRating(exerciseList[i].rating)
                  }
                }

              }
            }
          } catch (error) {
            console.error(error);
          }
        };
        getCurrentData();
      }
    }

    setCurrentExercise(currentEx);
    setExerciseInfoVisibility("flex");
    setSuccessMess("");
  }

  const handleRatingChange = (event: React.ChangeEvent<{ value: string }>) => {
    const rating = parseInt(event.target.value);
    //setCurrentRating(rating)
    setLastSelectedRating(rating);
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
            const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history

            for (
              let itemIndex = 0;
              itemIndex < exerciseList.length;
              itemIndex++
            ) {
              if (
                exerciseHistNames[index] === exerciseList[itemIndex].exercise
              ) {
                exerciseList.splice(itemIndex, 1);
                itemIndex--;
              }
            }

            setExerciseHistNames(exerciseList.map((item) => item.exercise)); // extract exercise names from list

            const docData = {
              exerciseHistory: exerciseList,
            };

            if (userID !== undefined) {
              // set the new  exercies list
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

  function handleSaveButton() {
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
            const exerciseListCopy = [...exerciseList];
            for (let i = 0; i < exerciseListCopy.length; i++) {
              if (currentExercise === exerciseListCopy[i].exercise) {
                if (currentRating !== undefined) {
                  exerciseListCopy[i].rating = currentRating;
                  setCurrentRating(exerciseListCopy[i].rating);

                }
              }
            }
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
  }

  return (
    <div>
      <div
        className="add-exercise-modal"
        style={{ display: addModalVisibility }}
      >
        <span className="close-button" onClick={() => closeAddExercise()}>
          &times;
        </span>
        <p>Select an exercise to add to your history:</p>
        <select className="selector">
          <option value="Treadmill">Treadmill</option>
          <option value="Leg Press">Leg Press</option>
        </select>
      </div>
      <div className="content">
        <p style={{ fontSize: "larger", fontWeight: "bold" }}>
          Exercise History:
        </p>

        <p>
          Welcome to your exercise history!! Here you can view exercises that
          you've saved, delete unwanted exercises, change the rating of an
          exercise so that it becomes more/less frequent, and add your own
          exercises!
        </p>
        {exerciseHistNames.map((item, index) => (
          <div className="exercise-pair" key={index}>
            <span
              className="delete-button"
              onClick={() => handleDeleteExercise(index)}
            >
              &times;
            </span>

            <p className="exercise" onClick={() => openInfoPopup(item)}>
              {item}
            </p>
          </div>
        ))}
        <button onClick={openAddExercise}>Add exercise</button>
        <div
          className="exercise-info-modal"
          style={{ display: exerciseInfoVisibility }}
        >
          <span className="close-button" onClick={() => closeInfoPopup()}>
            &times;
          </span>
          <div>
            <div style={{ display: "flex" }}>
              <p className="exercise-info">
                <span style={{ fontWeight: "bold" }}>Exercise:</span>
                {currentExercise}
              </p>
              <div>
                <p className="exercise-info">
                  <span style={{ fontWeight: "bold" }}>Last Used:</span>
                  {currentDate && currentDate.toDateString()}
                </p>
                <button>Edit</button>
              </div>
              <div>
                <p className="exercise-info">
                  <span style={{ fontWeight: "bold" }}>Latest Reps:</span>
                  {currentReps?.toString()}
                </p>
                <button>Edit</button>
              </div>
              {/* <label htmlFor="dateInput">Select a date:</label>
<input type="date" id="dateInput" name="dateInput"></input> */}

              <div>
                <p className="exercise-info">
                  <span style={{ fontWeight: "bold" }}>Latest Weight:</span>
                  {currentWeight?.toString()}
                </p>
                <button>Edit</button>
              </div>

              <div>
                <p className="exercise-info">
                  <span style={{ fontWeight: "bold" }}>Rating:</span>
                  {currentRating?.toString()}
                </p>
                <button>Edit</button>
              </div>

              <label className="rating-dropdown exercise-info">
                <span style={{ fontWeight: "bold" }}>Rating</span>

                <select className="selector" onChange={handleRatingChange}>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
            </div>
            <button style={{ marginTop: "50px" }} onClick={handleSaveButton}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
