import "../styles/App.css";
// import "../styles/Workout.css";
// import { ReactElement, SetStateAction, useEffect, useState } from "react";
import HomePage from "./home/home";
import MachinePage from "./machines/machinePage";
import ProgressPage from "./progress/progressPage";
import WorkoutPage from "./generator/basicWorkoutPage";
import React, { Component } from "react";
import AUTHMODAL from "./authentication/authModal";

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);

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
  }

  handleLoginButtonClick() {
    // setPageContent(progressPage());
    // call authentication here
    return undefined;
  }

  render() {
    return (
      <div className="App">
        <AUTHMODAL /> {/* Contains App header (BrownFit title) */}
        <button
          className="Navigation-Button"
          aria-label="home button"
          onClick={() => this.changePage("home")}
        >
          Home:
        </button>
        <button
          className="Navigation-Button"
          aria-label="workout button"
          onClick={() => this.changePage("workout")}
        >
          Generate Workout:
        </button>
        <button
          className="Navigation-Button"
          aria-label="machine button"
          onClick={() => this.changePage("machine")}
        >
          Nelson Machines:
        </button>
        <button
          className="Navigation-Button"
          aria-label="progress button"
          onClick={() => this.changePage("progress")}
        >
          Check Progress:
        </button>
        {this.state.currentPage === "home" && <HomePage />}
        {this.state.currentPage === "workout" && <WorkoutPage />}
        {this.state.currentPage === "machine" && <MachinePage />}
        {this.state.currentPage === "progress" && <ProgressPage />}
      </div>
    );
  }
}

export default App;
