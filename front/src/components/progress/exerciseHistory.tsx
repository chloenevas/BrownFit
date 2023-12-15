import { useState, useEffect, ChangeEvent } from "react";
import "../../styles/progress.css";
import { auth, database } from "../../index";
import {
  doc,
  DocumentData,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { ControlledInput } from "../ControlledInput";
import Select, { SingleValue } from "react-select";

export default function ExerciseHistory() {
  const [exerciseInfoVisibility, setExerciseInfoVisibility] = useState("none");
  const [currentExercise, setCurrentExercise] = useState("");
  const [currentRating, setCurrentRating] = useState<number | null>();
  const [currentReps, setCurrentReps] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentDate, setCurrentDate] = useState<Timestamp | null>();
  const [exerciseToAdd, setExerciseToAdd] = useState("none");
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentImage, setCurrentImage] = useState("");
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

  interface ExerciseInfo {
    rating: number;
    exercise: string;
    description: string;
    image: string;
    date: Timestamp;
    reps: number | null | string;
    weight: string | null;
  }

  const [exerciseHistory, setExerciseHistory] = useState<ExerciseInfo[]>([]);
  const [userData, setUserData] = useState<DocumentData>();

  useEffect(() => {
    async function accessCurrentUserInfo() {
      if (auth.currentUser !== null) {
        const currentUser = auth.currentUser;
        const userID = currentUser?.uid;

        if (userID !== undefined) {
          const currentUserDoc = doc(database, "users", userID); // get document of current logged in user
          const getUserData = async () => {
            try {
              const docSnapshot = await getDoc(currentUserDoc);
              if (docSnapshot.exists()) {
                // check to see if the doc exists
                console.log("access called");
                setUserData(docSnapshot.data());
              }
            } catch (error) {
              console.error(error);
            }
          };
          getUserData();
        }
      }
    }
    accessCurrentUserInfo();
  }, []); // only fetch data once upon page opening, otherwise will reach Firebase quota for reads

  /**
   * Setup initial exercise history with user's current workout history from database
   */
  function setupPage() {
    console.log("called");
    const getUserData = () => {
      if (userData !== undefined) {
        const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history
        setExerciseHistory(exerciseList);
        const names = exerciseList.map((item) => item.exercise);
        console.log("setup called");

        setExerciseHistNames(names); // set exercise history to be those names
      }
    };
    getUserData();
  }
  useEffect(() => {
    if (userData !== undefined) {
      // only set it up once userData is no longer
      setupPage();
    }
  }, [userData]);

  /**
   * Close the individual exercise info popup
   */
  function closeInfoPopup() {
    setExerciseInfoVisibility("none");
    setSuccessMess("");
    setEditDataVisibility("none");
    setViewDataVisibility("flex");
    setSaveEditButton("Edit");
  }

  /**
   * Accesses all of the user's information for the current exercise to be displayed
   *
   * @param currentEx - current exercise being displayed
   */
  function openInfoPopup(currentEx: string) {
    if (userData !== undefined) {
      const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history

      // go through user's exercise history and access the one that they clicked on
      for (let itemIndex = 0; itemIndex < exerciseList.length; itemIndex++) {
        if (currentEx === exerciseList[itemIndex].exercise) {
          // match current exercise to history exercise
          const seconds = exerciseList[itemIndex].date.seconds;
          const currentTimestamp = Timestamp.fromMillis(seconds * 1000);

          //update the info (date, reps, weght, etc.) to be displayed with the info from history
          setCurrentDate(currentTimestamp); // update date

          const reps = exerciseList[itemIndex].reps; // update reps
          if (reps === null || Number.isNaN(reps) || reps === "") {
            setCurrentReps("N/A");
          } else if (reps !== null) {
            setCurrentReps(reps.toString());
          }

          const weight = exerciseList[itemIndex].weight; // update weight
          if (weight === null || Number.isNaN(weight) || weight === "") {
            setCurrentWeight("N/A");
          } else if (weight !== null) {
            setCurrentWeight(weight.toString());
          }

          setCurrentRating(exerciseList[itemIndex].rating); // update rating
          setCurrentDescription(exerciseList[itemIndex].description); // update description
          setCurrentImage(exerciseList[itemIndex].image); // update image
        }
      }
    }
    setCurrentExercise(currentEx); // set the current exercise to be the one passed in
    setExerciseInfoVisibility("flex"); // make popup appear
    setSuccessMess("");
  }

  /**
   * Update the current rating based on what the dropdown was changed to
   *
   * @param event - change in rating dropdown
   */
  const handleRatingChange = (event: React.ChangeEvent<{ value: string }>) => {
    const rating = parseInt(event.target.value);
    setCurrentRating(rating);
  };

  /**
   * Deletes an exercise when a user clicks on the "x" next to it.
   *
   * @param index - index of exercise in the history
   */
  async function handleDeleteExercise(index: number) {
    if (userData !== undefined) {
      const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history

      for (let itemIndex = 0; itemIndex < exerciseList.length; itemIndex++) {
        if (
          exerciseHistNames[index] === exerciseList[itemIndex].exercise // access the exercise from history
        ) {
          exerciseList.splice(itemIndex, 1); // delete it from the list
          itemIndex--; // decrement index because we're doing deletion
        }
      }

      setExerciseHistNames(exerciseList.map((item) => item.exercise)); // extract exercise names from list

      const docData = {
        exerciseHistory: exerciseList, // update history with new list
      };

      if (auth.currentUser !== null) {
        const currentUser = auth.currentUser;
        const userID = currentUser?.uid;

        if (userID !== undefined) {
          // set the new  exercies list
          await setDoc(doc(database, "users", userID), docData, {
            merge: true,
          });
        }
      }
    }
  }

  /**
   * Update the user's database to reflect what they changed
   */
  const saveData = async () => {
    if (userData !== undefined) {
      const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history
      const exerciseListCopy: ExerciseInfo[] = [...exerciseList]; // make copy of exerciseList

      for (let itemIndex = 0; itemIndex < exerciseList.length; itemIndex++) {
        if (currentExercise === exerciseList[itemIndex].exercise) { // access exercise in database

          // set reps, weight, date, and rating
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

      if (auth.currentUser !== null) {
        const currentUser = auth.currentUser;
        const userID = currentUser?.uid;

        // update the user's database
        if (userID !== undefined) {
          await setDoc(doc(database, "users", userID), docData, {
            merge: true,
          });
          setSuccessMess("Information saved!");
        }
      }
    }
  };

  /**
   * Update the current date based on what was inputted on the calendar
   * @param event - change made by user
   */
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentTimestamp = Timestamp.fromMillis(
      Date.parse(event.target.value)
    );
    setCurrentDate(currentTimestamp);
  };

  /**
   * Change the save/edit button when the user clicks. Save data/change popup depending
   * on what the button was
   */
  function onSaveEditClick() {
    if (saveEditButton === "Save") {
      saveData();
    }

    if (saveEditButton === "Edit") {
      setSaveEditButton("Save");
      setViewDataVisibility("none");
      setEditDataVisibility("block");
    }
  }

  /**
   * Register what the user clicked from the add new exercise drop down and call the method 
   * to add it to their database
   * 
   * @param option - exercise that the user selects
   */
  const selectNewExercise = (
    option: SingleValue<{ label: string; value: string }>
  ) => {
    if (option !== null) {
      setExerciseToAdd(option.value);
    }
  };

  useEffect(() => {}, [exerciseToAdd]);


  /**
   * Adds a new exercise to the user's database by calling the backend to retrieve
   * info about that exercise
   */
  async function onAddExerciseClick() {

    // call the backend to access a json of the selected exercise 
    var apiFetchMap = await fetch(
      "http://localhost:3332/getMachine?machine=" + exerciseToAdd
    )
      .then((response) => response.json())
      .then((json) => {
        return json;
      });
    
    // sets workoutMap state to the json returned by generateWorkout
    const exercise = apiFetchMap;

    const currentDate: Date = new Date();

    const seconds: number = Math.floor(currentDate.getTime() / 1000);
    const nanoseconds: number = (currentDate.getTime() % 1000) * 1e6;

    // create Firebase Timestamp object
    const currentTimestamp: Timestamp = new Timestamp(seconds, nanoseconds);

    // create an object that contains all of the info
    const newExercise: ExerciseInfo = {
      exercise: exercise.name,
      rating: 0,
      image: "src/components" + exercise.img,
      description: exercise.instructions,
      reps: null,
      weight: null,
      date: currentTimestamp,
    };

    if (userData !== undefined) {
      const exerciseList: ExerciseInfo[] = userData.exerciseHistory; // get user's current exercise history

      exerciseList.push(newExercise);
      setExerciseHistNames(exerciseList.map((item) => item.exercise)); // extract exercise names from list

      const docData = {
        exerciseHistory: exerciseList,
      };

      if (auth.currentUser !== null) {
        const currentUser = auth.currentUser;
        const userID = currentUser?.uid;
        if (userID !== undefined) {
          await setDoc(doc(database, "users", userID), docData, { // update the user's doc with the new exercise
            merge: true,
          });
        }
      }
    }
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
            <p style={{ fontSize: "larger", fontWeight: "bold" }}>
              Exercise: {currentExercise}
            </p>

            <p>{currentDescription}</p>
            {currentImage && (
              <div className="image-container">
                <img
                  src={currentImage}
                  alt={`Image for ${currentImage}`}
                  style={{
                    width: "400px",
                    height: "400px",
                  }}
                />
              </div>
            )}
            <div style={{ display: "flex" }}>
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
            <p>{successMess}</p>
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
