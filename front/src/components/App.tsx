import "../styles/App.css";
// import "../styles/Workout.css";
// import { ReactElement, SetStateAction, useEffect, useState } from "react";
import HomePage from "./home/home";
import MachinePage from "./machines/machinePage";
import ProgressPage from "./progress/progressPage";
import WorkoutPage from "./generator/basicWorkoutPage";
import AccountInfo from "./progress/accountInfo";
import AdditionalInfo from "./additional/additionalPage";


import React, { Component, useState } from "react";
import AUTHMODAL from "./authentication/authModal";
import { auth, database, collectionRef, users } from "../index";
import {
 collection,
 addDoc,
 updateDoc,
 doc,
 onSnapshot,
 getDoc,
 query,
 where,
} from "firebase/firestore";
import {
 getAuth,
 onAuthStateChanged,
 setPersistence,
 browserSessionPersistence,
} from "firebase/auth";


class App extends Component<any, any> {
 homeButtonColor: string;
 workoutButtonColor: string;
 machineButtonColor: string;
  progressButtonColor: string;
 progressVisibility: string;
 accountButtonColor: string;
 additionalButtonColor: string;


 constructor(props: any) {
   super(props);
   this.homeButtonColor = "red";
   this.workoutButtonColor = "#453131";
   this.machineButtonColor = "#453131";
   this.progressButtonColor = "#453131";
   this.progressVisibility = "none";
   this.accountButtonColor = "#453131";
   this.additionalButtonColor = "#453131";
   




   this.checkUser();
   setInterval(() => {
     this.checkUser();
   }, 100);
   this.state = {
     currentPage: "home",
     // // tracking key pressing for zooming
     // useEffect(() => {
     //   setPageContent(HomePage());
     //   const detectKeyDown = (e: { key: string }) => {
     //     //if someone is pressing down shift, we are zooming in
     //     if (e.key === "CapsLock") {
     //       console.log("CapsLock is pressed. Calling zoom-in function...");
     //       document.body.style.fontSize = `${
     //         parseInt(getComputedStyle(document.body).fontSize) + 2
     //       }px`;
     //       // if someone is pressing down control, we are zooming out
     //     } else if (e.key === "Control") {
     //       console.log("Ctrl key pressed. Calling zoom-out function...");
     //       document.body.style.fontSize = `${
     //         parseInt(getComputedStyle(document.body).fontSize) - 2
     //       }px`;
     //     }
   };


   // Binding the methods to the class instance
   this.changePage = this.changePage.bind(this);
 }


 changePage(page: string) {
   this.setState({ currentPage: page });
   if (page == "home") {
     this.homeButtonColor = "red";
     this.workoutButtonColor = "#453131";
     this.machineButtonColor = "#453131";
     this.progressButtonColor = "#453131";
     this.accountButtonColor = "#453131";
     this.additionalButtonColor = "#453131";

   } else if (page == "workout") {
     this.homeButtonColor = "#453131";
     this.workoutButtonColor = "red";
     this.machineButtonColor = "#453131";
     this.progressButtonColor = "#453131";
     this.accountButtonColor = "#453131";
     this.additionalButtonColor = "#453131";

   } else if (page == "machine") {
     this.homeButtonColor = "#453131";
     this.workoutButtonColor = "#453131";
     this.machineButtonColor = "red";
     this.progressButtonColor = "#453131";
     this.accountButtonColor = "#453131";
     this.additionalButtonColor = "#453131";

   }
   else if (page === "account") {
    this.accountButtonColor = "red";
    this.homeButtonColor = "#453131";
     this.workoutButtonColor = "#453131";
     this.machineButtonColor = "#453131";
     this.progressButtonColor = "#453131";
     this.additionalButtonColor = "#453131";
     

    } 
    else if (page === "additional") {
      this.accountButtonColor = "#453131";
      this.homeButtonColor = "#453131";
       this.workoutButtonColor = "#453131";
       this.machineButtonColor = "#453131";
       this.progressButtonColor = "#453131";
       this.additionalButtonColor = "red";

      }else {
     this.homeButtonColor = "#453131";
     this.workoutButtonColor = "#453131";
     this.machineButtonColor = "#453131";
     this.progressButtonColor = "red";
    this.accountButtonColor = "#453131";
    this.additionalButtonColor = "#453131";




   }
 }


 checkUser() {
   auth.onAuthStateChanged((user) => {
     if (user !== null) {
       this.setState({ progressVisibility: "flex" });
     } else {
       this.setState({ progressVisibility: "none" });
     }
     if (
       this.state.currentPage === "progress" &&
       this.state.progressVisibility === "none"
     ) {
       this.changePage("home");
     }
   });
 }


 render() {
   return (
     <div className="App">
       <AUTHMODAL /> {/* Contains App header (BrownFit title) */}
       {/* Menu Bar */}
       <div className="MenuBar">
         <button
           className="Navigation-Button"
           aria-label="home button"
           onClick={() => this.changePage("home")}
           style={{ backgroundColor: this.homeButtonColor }}
         >
           Home
         </button>
         <button
           className="Navigation-Button"
           aria-label="workout button"
           onClick={() => this.changePage("workout")}
           style={{ backgroundColor: this.workoutButtonColor }}
         >
           Generate Workout
         </button>
         <button
           className="Navigation-Button"
           aria-label="machine button"
           onClick={() => this.changePage("machine")}
           style={{ backgroundColor: this.machineButtonColor }}
         >
           Nelson Machines
         </button>
         <button
           className="Navigation-Button"
           aria-label="progress button"
           onClick={() => this.changePage("progress")}
           style={{
             backgroundColor: this.progressButtonColor,
             display: this.state.progressVisibility,
           }}
         >
           Check Progress
         </button>
         <button
   className="Navigation-Button"
   aria-label="account info button"
   onClick={() => this.changePage("account")}
   style={{ backgroundColor: this.accountButtonColor,
    display: this.state.progressVisibility, }}
 >
   Account Info
 </button>
 <button
   className="Navigation-Button"
   aria-label="additional"
   onClick={() => this.changePage("additional")}
   style={{ backgroundColor: this.additionalButtonColor,
    display: this.state.additionalVisibility, }}
 >
Additional Info
 </button>
       </div>
       <div className="Content">
         {this.state.currentPage === "home" && <HomePage />}
         {this.state.currentPage === "workout" && <WorkoutPage />}
         {this.state.currentPage === "machine" && <MachinePage />}
         {this.state.currentPage === "progress" && <ProgressPage />}
         {this.state.currentPage === "account" && <AccountInfo />}
         {this.state.currentPage === "additional" && < AdditionalInfo/>}




       </div>
     </div>
   );
 }
}


export default App;



