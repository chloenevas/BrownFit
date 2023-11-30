import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./components/App";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore, collection, getDocs } from "firebase/firestore";

// Tim removed some boilerplate to keep things simple.
// We're using an older version of React here.

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const firebaseConfig = {
  apiKey: "AIzaSyDNAqjFobi6MXk82hoUUn_LnhXcq5GNyJA",
  authDomain: "brownfit-b8b8c.firebaseapp.com",
  projectId: "brownfit-b8b8c",
  storageBucket: "brownfit-b8b8c.appspot.com",
  messagingSenderId: "607507920015",
  appId: "1:607507920015:web:c93b9dfad52c10963f2cfa",
};

// initialize firebase app
const app = initializeApp(firebaseConfig);

// initialize authorization
export const auth = getAuth(app);

// initialize firestore service
const database = getFirestore();

// get collection reference from database --> accesses users collection
const collectionRef = collection(database, "users");

// gets all the documents within users collection
getDocs(collectionRef)
  .then((snapshot) => {
    let users: { id: string }[] = [];
    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });
    console.log(users);
  })
  .catch((err) => {
    console.log(err.message);
  });
