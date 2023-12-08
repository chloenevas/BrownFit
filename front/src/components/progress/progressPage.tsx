
import { useState } from "react";
import { ControlledInput } from "../ControlledInput";
import "../../styles/progress.css";
import { auth, database, collectionRef, users} from "../../index";
import {
  collection, addDoc, updateDoc, doc, onSnapshot, getDoc,
  query, where, setDoc
} from "firebase/firestore";
import AccountInfo from "./accountInfo"
import ExerciseHistory from "./exerciseHistory";
import Consistency from "./consistency";


export default function ProgressPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [editVisibility, setEditVisibility] = useState("none");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [currentPage, setCurrentPage] = useState("account info");
  const [infoButton, setInfoButton] = useState("red");
  const [exerciseHistoryButton, setExerciseHistoryButton] = useState("");
  const [consistencyButton, setConsistencyButton] = useState("");

  function changePage(page: string) {
    setCurrentPage(page);
    if (page == "account info") {
      setInfoButton("red");
      setExerciseHistoryButton("");
      setConsistencyButton("");
    } else if (page == "exercise history") {
      setInfoButton("");
      setExerciseHistoryButton("red");
      setConsistencyButton("");
    } else {
      setInfoButton("");
      setExerciseHistoryButton("");
      setConsistencyButton("red");
    } 
  }
  
    return (
      <div className="progress-page">
        <div className="button-sidebar">
          <button
            className="navigation-button"
            style={{ backgroundColor: infoButton }}
            onClick={() => changePage("account info")}
          >
            Account Info
          </button>
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
          {currentPage === "account info" && <AccountInfo />}
          {currentPage === "exercise history" && <ExerciseHistory />}
          {currentPage === "consistency" && <Consistency />}
        </div>
      </div>
    );
  }
