
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
  Timestamp,
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
 const [selectedExercise, setSelectedExercise] = useState<ExerciseInfo | null>(null);



    interface ExerciseInfo {
      rating: number;
      exercise: string;
      description: string;
      image: string | null;
      date: Timestamp;
      reps: number | null;
      weight: string | null;
    }
  
  let showImg = "none";


 //here, exeriseList correctly reads in the back end workout generated.
 //just need to figure out how to display it
 exerciseList = workoutMap;
 const map = new Map(
   exerciseList.map((obj) => [
     obj.name,
     obj.img ? obj.img + " " + obj.instructions : " " + obj.instructions,
   ])
 );


const currentDate: Date = new Date();

const seconds: number = Math.floor(currentDate.getTime() / 1000); 
const nanoseconds: number = (currentDate.getTime() % 1000) * 1e6; 

// Create Firebase Timestamp object 
  const currentTimestamp: Timestamp = new Timestamp(seconds, nanoseconds);
    const newExerciseHistory: ExerciseInfo[] = Array.from(map).map(
      ([key, value]) => {
        return {
          exercise: key,
          rating: 0,
          image: getImg(value),
          description: getInstructions(value),
          date: currentTimestamp,
          reps: null,
          weight: null,
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
     console.log("saving exercises")
     updateExerciseHistory();
     setSaveSuccessMess("Exercises successfully saved to user history!");
   }
   }
 


   function getImg(val: string) {
    let spaceIndex = val.indexOf(" ");
    let imgPath = val.substring(0, spaceIndex);
  
    return imgPath.includes("/") ? "src/components" + val.substring(0, spaceIndex) : null;
  }

 function getInstructions(val: string) {
   let spaceIndex = val.indexOf(" ");
   return val.substring(spaceIndex, val.length);
 }


//  const handleExerciseClick = (key: string) => {
//    setInfoVisibility("flex");
//    if (clickedItem === key) {
//      setClickedItem(null);
//      setInfoVisibility("none");
//    } else {
//      setClickedItem(key);
// //    }
//  };
 const handleExerciseClick = (exercise: ExerciseInfo) => {
  if (selectedExercise?.exercise === exercise.exercise) {
    setSelectedExercise(null);
  } else {
    setSelectedExercise(exercise);
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
       console.log(typeof (userExerciseHist))
               console.log(typeof newExerciseHistory);


       let historyNames: string[] = []
       let newNames: string[] = [];


       let mergedExerciseData;


       {
         Array.from(userExerciseHist).map(
           (item) =>  historyNames.push(item.exercise) // add every name
         );
       }
       {
         Array.from(newExerciseHistory).map(
           (item) => newNames.push(item.exercise) // add every name
         );
       }


       // if there are duplicate exercises, remove them from new exercise list before they get added to history
      
       newExerciseHistory.forEach((newExercise: ExerciseInfo, newIndex) => {
         for (let oldIndex = 0; oldIndex < userExerciseHist.length; oldIndex++) {
             if (newExercise.exercise === userExerciseHist[oldIndex].exercise) {
             newExerciseHistory.splice(newIndex, 1);
           }
         }
         })


       if (Object.keys(userExerciseHist).length == 0) { // check that the history isn't empty


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
        <span className="close-button" onClick={() => handleCloseClick()}>&times;</span>
        <div className="modal-content">
          <div className="header-workout">
            <p>
              <span style={{ fontWeight: 'bold'}}>
                {muscleValue.charAt(0).toUpperCase() + muscleValue.slice(1).toLowerCase()}
              </span>{' '}
              {muscleValue2 && (
                <>
                  <span style={{ fontWeight: 'bold' }}>and</span>{' '}
                  <span style={{ fontWeight: 'bold' }}>
                    {muscleValue2.charAt(0).toUpperCase() + muscleValue2.slice(1).toLowerCase()}
                  </span>
                </>
              )}
            </p>
            <p>Duration: {durationValue}</p>
            <p>Goal: {goalValue}</p>
          </div>

          <p>Click any exercise to view more info</p>

          <div className="horizontal-menu">
          {newExerciseHistory.map((exercise: ExerciseInfo, index: number) => (

<button
key={index}
className={selectedExercise?.exercise === exercise.exercise ? "menu-item active" : "menu-item"}
onClick={() => handleExerciseClick(exercise)}
>  {exercise.exercise}
              </button>
                             ))}
                             </div>
                             <div className="exercise-info" style={{ padding: selectedExercise ? '20px' : '0', display: selectedExercise ? 'block' : 'none' }}>
            {selectedExercise && selectedExercise.image && (
              <div>
                  <div className="image-container">

                <img
                  src={selectedExercise.image}
                  alt={`Image for ${selectedExercise.exercise}`}
                  style={{
                    width: '400px',
                    height: '400px',
                  }}
                />
                              </div>

                <p>{selectedExercise.description}</p>
              </div>
            )}
            {selectedExercise && !selectedExercise.image && selectedExercise.description && (
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