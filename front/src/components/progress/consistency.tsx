import { useState, useEffect } from "react";
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

export default function Consistency() {


  return (
    <div className="progress-page">
      <div className="content">
        <p style={{ fontSize: "50px", fontWeight: "bold", alignContent: "center" }}>
          COMING SOON!
        </p>
      </div>
    </div>
  );
}
