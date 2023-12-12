import { useState, useEffect, ChangeEvent, SetStateAction } from "react";
import "../../styles/progress.css";
import { auth, database } from "../../index";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { it } from "node:test";
import { ControlledInput } from "../ControlledInput";
import Select, { SingleValue } from "react-select";

export default function ExerciseHistory() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [exerciseInfoVisibility, setExerciseInfoVisibility] = useState("none");
  const [currentExercise, setCurrentExercise] = useState("");
  const [currentRating, setCurrentRating] = useState<number | null>();
  const [currentReps, setCurrentReps] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentDate, setCurrentDate] = useState<Timestamp | null>();
  const [currentTimestamp, setCurrentTimestamp] = useState<Timestamp | null>();
  const [exerciseToAdd, setExerciseToAdd] = useState("none");

  const [viewDataVisibility, setViewDataVisibility] = useState("flex");
  const [editDataVisibility, setEditDataVisibility] = useState("none");
  const [saveEditButton, setSaveEditButton] = useState("Edit");

  const [successMess, setSuccessMess] = useState("");

  const [exerciseHistNames, setExerciseHistNames] = useState<string[]>([]);

  const machineData = [
    { label: "Ab Crunch", value: "Ab Crunch" },
    { label: "Back Row", value: "Back Row" },
    { label: "Bench Press", value: "Bench Press" },
    { label: "Calf Raise", value: "Calf Raise" },
    { label: "Chest Press", value: "Chest Press" },
    { label: "Chin Dip", value: "Chin Dip" },
    { label: "Dependent Curl", value: "Dependent Curl" },
    { label: "Double Cable Stack", value: "Double Cable Stack" },
    { label: "Elliptical", value: "Elliptical" },
    { label: "Glute Trainer", value: "Glute Trainer" },
    { label: "Hip Abductor", value: "Hip Abductor" },
    { label: "Lat Pulldown", value: "Lat Pulldown" },
    { label: "Leg Curl", value: "Leg Curl" },
    { label: "Leg Extenstion", value: "Leg Extension" },
    { label: "Leg Press", value: "Leg Press" },
    { label: "Low Row", value: "Low Row" },
    { label: "Rear Delt Pec Fly", value: "Rear Delt Pec Fly" },
    { label: "Rotary Torso", value: "Rotary Torso" },
    { label: "Shoulder Press", value: "Shoulder Press" },
    { label: "Squat Rack", value: "Squat Rack" },
    { label: "Stairmaster", value: "Stairmaster" },
    { label: "Treadmill", value: "Treadmill" },
    { label: "Triceps Press", value: "Triceps Press" },
    { label: "Triceps Pulldown", value: "Triceps Pulldown" },
    { label: "Vertical Bench Press", value: "Vertical Bench Press" },
    { label: "Vertical Chest Press", value: "Vertical Chest Press" },
  ];

  type OptionType = {
    label: string;
    value: string;
  };

  interface ExerciseInfo {
    rating: number;
    exercise: string;
    description: string;
    image: string;
    date: Timestamp;
    reps: number | null;
    weight: string | null;
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

  function closeInfoPopup() {
    setExerciseInfoVisibility("none");
    setSuccessMess("");
    setEditDataVisibility("none");
    setViewDataVisibility("flex");
    setSaveEditButton("Edit");
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
                if (currentEx === exerciseList[itemIndex].exercise) {
                  const seconds = exerciseList[itemIndex].date.seconds;
                  console.log(new Date(seconds * 1000));
                  console.log(typeof new Date(seconds * 1000));
                  const currentTimestamp = Timestamp.fromMillis(seconds * 1000);

                  setCurrentDate(currentTimestamp);
                  const reps = exerciseList[itemIndex].reps;
                  if (reps === null || Number.isNaN(reps)) {
                    setCurrentReps("N/A");
                  } else if (reps !== null) {
                    setCurrentReps(reps.toString());
                  }

                  const weight = exerciseList[itemIndex].weight;
                  if (weight === null || Number.isNaN(weight)) {
                    setCurrentWeight("N/A");
                  } else if (weight !== null) {
                    setCurrentWeight(weight.toString());
                  }
                  setCurrentRating(exerciseList[itemIndex].rating);
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
    setCurrentRating(rating);
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

  const saveData = async () => {
    if (auth.currentUser !== null) {
      const currentUser = auth.currentUser;
      const userID = currentUser?.uid;
      const currentUserDoc = doc(database, "users", userID); // get document of current logged in user

      try {
        const docSnapshot = await getDoc(currentUserDoc);

        if (docSnapshot.exists()) {
          // check to see if the doc exists
          const userData = docSnapshot.data();
          const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history
          const exerciseListCopy: ExerciseInfo[] = [...exerciseList]; // make copy of exerciseList

          for (
            let itemIndex = 0;
            itemIndex < exerciseList.length;
            itemIndex++
          ) {
            if (currentExercise === exerciseList[itemIndex].exercise) {
              exerciseListCopy[itemIndex].reps = parseInt(currentReps);
              exerciseListCopy[itemIndex].weight = currentWeight;
              if (currentDate !== undefined && currentDate !== null) {
                exerciseListCopy[itemIndex].date = currentDate;
              }
              if (currentRating !== null && currentRating !== undefined) {
                exerciseListCopy[itemIndex].rating = currentRating;
              }
            }
          }

          const docData = {
            exerciseHistory: exerciseListCopy,
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
    }
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentTimestamp = Timestamp.fromMillis(
      Date.parse(event.target.value)
    );
    setCurrentDate(currentTimestamp);
  };

  function onSaveEditClick() {
    if (saveEditButton === "Save") {
      // save stuff
      saveData();
    }

    if (saveEditButton === "Edit") {
      setSaveEditButton("Save");
      setViewDataVisibility("none");
      setEditDataVisibility("block");
    }
  }

  const selectNewExercise = (
    option: SingleValue<{ label: string; value: string }>
  ) => {
    if (option !== null) {
      setExerciseToAdd(option.value);
    }
  };

  useEffect(() => {
    console.log(exerciseToAdd);
  }, [exerciseToAdd]);

 
  async function onAddExerciseClick() {
    var apiFetchMap: Array<any> = await fetch(
      "http://localhost:3332/getMachine?machine=" + exerciseToAdd
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        return json;
      });
    //sets workoutMap state to the json returned by generateWorkout
    console.log(apiFetchMap);
  }


  return (
    <div>
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
        <div
          className="exercise-info-modal"
          style={{ display: exerciseInfoVisibility }}
        >
          <span className="close-button" onClick={() => closeInfoPopup()}>
            &times;
          </span>
          <div>
            <div style={{ display: "flex" }}>
              <p className="exercise-info">Exercise: {currentExercise}</p>
              <div>
                <div>
                  <p
                    className="exercise-info"
                    style={{ display: viewDataVisibility }}
                  >
                    Last Used:{" "}
                    {currentDate &&
                      new Date(currentDate.toMillis()).toDateString()}
                  </p>
                </div>

                <div style={{ display: editDataVisibility }}>
                  <label htmlFor="dateInput" className="calendar-popup">
                    Last Used:
                  </label>
                  <input
                    type="date"
                    id="dateInput"
                    name="dateInput"
                    style={{ display: "block" }}
                    onChange={handleDateChange}
                  ></input>
                </div>
              </div>
              <div>
                <p
                  className="exercise-info"
                  style={{ display: viewDataVisibility }}
                >
                  Latest Reps: {currentReps?.toString()}
                </p>
                <div style={{ display: editDataVisibility }}>
                  <div className="exercise-info-edit">
                    <legend>Reps:</legend>
                    <ControlledInput
                      type="text"
                      value={currentReps}
                      setValue={setCurrentReps}
                      ariaLabel={"reps input box"}
                      className="exercise-info-edit"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p
                  className="exercise-info"
                  style={{ display: viewDataVisibility }}
                >
                  Latest Weights: {currentWeight?.toString()}
                </p>
                <div style={{ display: editDataVisibility }}>
                  <div className="exercise-info-edit">
                    <legend>Weight:</legend>
                    <ControlledInput
                      type="text"
                      value={currentWeight}
                      setValue={setCurrentWeight}
                      ariaLabel={"weight input box"}
                      className="exercise-info-edit"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p
                  className="exercise-info"
                  style={{ display: viewDataVisibility }}
                >
                  Rating: {currentRating?.toString()}
                </p>
                <div style={{ display: editDataVisibility }}>
                  <div className="exercise-info-edit">
                    <label className="rating-dropdown exercise-info">
                      Rating
                      <select
                        className="selector"
                        onChange={handleRatingChange}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => onSaveEditClick()}>{saveEditButton}</button>
          </div>
        </div>
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
        <div>
          <p style={{ fontSize: "larger", fontWeight: "bold" }}>
            Add an exercise to your history
          </p>
          <Select options={machineData} onChange={selectNewExercise} />
        </div>
        <button onClick={onAddExerciseClick}>Add exercise</button>
      </div>
    </div>
  );
}
