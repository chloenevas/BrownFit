import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <div className="homeContent">
        <section>
          <h1>What is BrownFit?</h1>
          <p className="aboutSection">
            Brownfit is a webApp dedicated to helping members of the Brown
            community get started on their workout journeys! Using the machines
            specifically available at the Nelson Fitness Center, you can
            generate a personalized workout. You can also create an account in
            order to track your gym-going progress!
          </p>
        </section>

        <section>
          <h1>General Healthy Workout tips:</h1>
          <ul className="noBulletPoints">
            <li>Listen to your body. Don't overlift!</li>
            <li>Stay hydrated.</li>
            <li>Build in rest time.</li>
            <li>idk</li>
          </ul>
        </section>
      </div>
    );
  }
}

export default HomePage;
