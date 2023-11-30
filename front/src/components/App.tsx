import "../styles/App.css";
// import "../styles/Workout.css";
// import { ReactElement, SetStateAction, useEffect, useState } from "react";
import HomePage from "./home/home";
import MachinePage from "./machines/machinePage";
import ProgressPage from "./progress/progressPage";
import WorkoutPage from "./generator/basicWorkoutPage";
import React, { Component } from "react";

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentPage: "home",
    };

    // Binding the methods to the class instance
    this.changePage = this.changePage.bind(this);
  }

  changePage(page: string) {
    this.setState({ currentPage: page });
  }

  render() {
    return (
      <div className="App">
        <p className="App-header">
          <h1>BrownFit</h1>
        </p>
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
