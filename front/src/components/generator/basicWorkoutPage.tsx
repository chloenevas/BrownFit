import React, { useState } from "react";
import "../../styles/Workout.css";
import RESULTMODAL from "./resultModal";
import { auth, database } from "../../index";
import { doc, getDoc, Timestamp} from "firebase/firestore";

//Models the generate workout page 
export default function WorkoutPage() {
  const [durationValue, setDurationValue] =
    React.useState("30 minutes or less");
  const [muscleValue, setMuscleValue] = React.useState("full body");
  const [muscleValue2, setMuscleValue2] = React.useState("N/A");
  const [goalValue, setGoalValue] = React.useState("strength");
  const [modalVisibility, setModalVisibility] = React.useState("none");
  const [workoutMap, setWorkoutMap] = React.useState(new Array<any>());
  const [userRatings, setUserRatings] = useState("");

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

  //responsible for duration  dropdown
  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDurationValue(event.target.value);
    console.log(durationValue);
  };

  //responsible for muscle1 dropdown
  const handleMuscleGroupChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMuscleValue(event.target.value);
  };

  //responsible for muscle2 dropdown
  const handleMuscleGroup2Change = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMuscleValue2(event.target.value);
  };

  //responsible for goal dropdown
  const handleGoalChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setGoalValue(event.target.value);
  };

  /**
   * Gets the current user's exercise history and creates a string matching
   * exercise with rating to pass into the API on the backend. This is so that 
   * the backend can take into account user rankings in its generation.
   */
  async function getUserRatings() {
    if (auth.currentUser !== null) {
      
      // get current user
      const currentUser = auth.currentUser;
      const userID = currentUser?.uid;
      const currentUserDoc = doc(database, "users", userID);

      const docSnapshot = await getDoc(currentUserDoc);
      if (docSnapshot.exists()) {
        // check to see if the doc exists
        const userData = docSnapshot.data();

        // get exercise history
        const userExerciseHist: ExerciseInfo[] = userData.exerciseHistory;
        
        let userRatingsList: [string, string][] = []; 

        for (let i = 0; i < userExerciseHist.length; i++) { // add user exercises/ratings to a list of duples
          userRatingsList.push([userExerciseHist[i].exercise, userExerciseHist[i].rating.toString()]);
        }

        let userRatingsString: string = ""
        for (let i = 0; i < userRatingsList.length; i++) { // convert the list into a string to be parsed by backend
          const exerciseRatePair = userRatingsList[i][0] + "/" + userRatingsList[i][1]
          if (userRatingsString == "") {
            userRatingsString = exerciseRatePair;
          }
          else {
            userRatingsString += ";" + exerciseRatePair;
          }
        }
        setUserRatings(userRatingsString);
      }
    }
    
  }

  /**
   * Called everytime someone clicks the generate workout button. Calls the backend and passes
   * in the user input and user exercise rankings to produce a workout for the user
   */
  async function clickHandler() {
    setModalVisibility("flex"); // make the result popup appear
    getUserRatings();

    // makes API call to get workout based on passed in info
    try {
      var apiFetchMap: Array<any> = await fetch(
        "http://localhost:3332/generateWorkout?duration=" +
          durationValue +
          "&muscle1=" +
          muscleValue +
          "&muscle2=" +
          muscleValue2 +
          "&goal=" +
          goalValue +
          "&history=" +
          userRatings
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          return json;
        });
      //sets workoutMap state to the json returned by generateWorkout
      setWorkoutMap(apiFetchMap);
    } catch (err) {
      // If server isn't currently running, return mocked data 
      const exercise1 = {
        name: "MOCKED: Back Row",
        weight: "higher",
        reps: "fewer: 4-8",
        img: "/nelsonMachines/backRow.png",
        instructions: "Instructions for Back Row",
        muscle: ["upper back", "lower back"],
      };
      const exercise2 = {
        name: "MOCKED: Shoulder Press",
        weight: "lower",
        reps: "fewer: 4-8",
        img: "/nelsonMachines/shoulderPress.png",
        instructions: "Instructions for Shoulder Press",
        muscle: ["chest", "shoulders", "middle back", "triceps"],
      };
      const exercise3 = {
        name: "MOCKED: Weighted Pull-up",
        weight: "lower",
        reps: "fewer: 4-8",
        instructions: "Instructions for Weighted Pull-up",
        muscle: ["lats"],
      };
      const exerciseArray: Array<any> = [exercise1, exercise2, exercise3];
      setWorkoutMap(exerciseArray);
    }
  }

  return (
    <div>
      <div>
        <RESULTMODAL
          durationValue={durationValue}
          muscleValue={muscleValue}
          muscleValue2={muscleValue2}
          goalValue={goalValue}
          modalVisibility={modalVisibility}
          setModalVisibility={setModalVisibility}
          workoutMap={workoutMap}
        />
      </div>
      <p className="dayWorkoutHeader">
        <h1>Get a workout for today!</h1>
      </p>
      <p className="informationHeader">
        <h1>
          Enter the following information to generate a presonalized Nelson
          Fitness Center workout!
        </h1>
      </p>
      <p className="dropdownLabel">
        <label>
          How long would you like to workout for?
          <select value={durationValue} onChange={handleChange}>
            <option value="30 minutes or less">30 minutes or less</option>

            <option value="30-60 minutes">30-60 minutes</option>

            <option value="60-90 minutes">60-90 minutes</option>

            <option value="90-120 minutes">90-120 minutes</option>

            <option value="120 minutes or more">120 minutes or more</option>
          </select>
        </label>
      </p>
      <p className="dropdownLabel">
        <label>
          What muscle groups would you like to work on?
          <select value={muscleValue} onChange={handleMuscleGroupChange}>
            <option value="full body">full body</option>
            <option value="calves">calves</option>
            <option value="quads">quads</option>
            <option value="hamstrings">hamstrings</option>
            <option value="triceps">triceps</option>
            <option value="biceps">biceps</option>
            <option value="chest">chest</option>
            <option value="shoulders">shoulders</option>
            <option value="upper back">upper back</option>
            <option value="lower back">lower back</option>
            <option value="delts">delts</option>
            <option value="glutes">glutes</option>
            <option value="abdominals">abdominals</option>
          </select>
          <select value={muscleValue2} onChange={handleMuscleGroup2Change}>
            <option value="full body">N/A</option>
            <option value="full body">full body</option>
            <option value="calves">calves</option>
            <option value="quads">quads</option>
            <option value="hamstrings">hamstrings</option>
            <option value="triceps">triceps</option>
            <option value="biceps">biceps</option>
            <option value="chest">chest</option>
            <option value="shoulders">shoulders</option>
            <option value="upper back">upper back</option>
            <option value="lower back">lower back</option>
            <option value="delts">delts</option>
            <option value="glutes">glutes</option>
            <option value="abdominals">abdominals</option>
          </select>
        </label>
      </p>
      <p className="dropdownLabel">
        <label>
          What is your workout goal?
          <select value={goalValue} onChange={handleGoalChange}>
            <option value="strengthen muscles">strengthen muscles</option>

            <option value="increase muscle endurance">
              increase muscle endurance
            </option>

            <option value="build muscles">build muscles</option>

            <option value="burn calories">burn calories</option>

            <option value="just get a good sweat in!">
              just get a good sweat in!
            </option>
          </select>
        </label>
      </p>
      <button className="generateButton" onClick={clickHandler}>
        Make me a workout!
      </button>
    </div>
  );
}
