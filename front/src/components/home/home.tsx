import { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <div>
        <p className="aboutSection">
          <h1>What is BrownFit?</h1>
        </p>
        <p className="aboutText">
          <h1>
            Brownfit is a webApp dedicated to helping members of the Brown
            community get started on their workout journeys! Using the machines
            specifically available at the Nelson Fitness Center, you can
            generate a personalized workout. You can also create an account in
            order to track your gym-going progress!
          </h1>
        </p>
        <p className="healthyWorkoutSection">
          <h1>General Healthy Workout tips:</h1>
        </p>
        <p className="aboutText">
          <h1>1. Listen to your body.Don't overlift!</h1>
          <h1>2. Stay hydrated.</h1>
          <h1>3. Build in rest time.</h1>
          <h1>4. idk</h1>
        </p>
      </div>
    );
  }
}
export default HomePage;
