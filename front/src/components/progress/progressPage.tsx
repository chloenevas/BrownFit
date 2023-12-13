

import { useState } from "react";
import { ControlledInput } from "../ControlledInput";
import "../../styles/progress.css";

import ExerciseHistory from "./exerciseHistory";
import Consistency from "./consistency";




export default function ProgressPage() {
 const [currentPage, setCurrentPage] = useState("exercise history");
 const [exerciseHistoryButton, setExerciseHistoryButton] = useState("red");
 const [consistencyButton, setConsistencyButton] = useState("");


 function changePage(page: string) {
   setCurrentPage(page);
   if (page == "exercise history") {
     setExerciseHistoryButton("red");
     setConsistencyButton("");
   } else {
     setExerciseHistoryButton("");
     setConsistencyButton("red");
   }
 }
    return (
     <div className="progress-page">
       <div className="button-sidebar">


         <button
           className="navigation-button"
           style={{ backgroundColor: exerciseHistoryButton }}
           onClick={() => changePage("exercise history")}
         >
           Exercise History
         </button>
         <button
           className="navigation-button"
           style={{ backgroundColor: consistencyButton }}
           onClick={() => changePage("consistency")}
         >
           Consistency
         </button>
       </div>
       <div className="content">
         {currentPage === "exercise history" && <ExerciseHistory />}
         {currentPage === "consistency" && <Consistency />}
       </div>
     </div>
   );
 }
