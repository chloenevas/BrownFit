import React, { Component } from "react";

class HomePage extends Component {
  render() {
    return (
      <div className="homeContent">
        <section>
          <h1>What is BrownFit?</h1>
          <p className="aboutSection">
            Brownfit is a webApp dedicated to helping members of the Brown
            community get started on their workout journeys! Geared specifically
            towards beginners, you can input information such as your workout
            goal and workout length, and using machines specifically available
            at the Nelson Fitness Center, a personalized workout will be created
            for you. You can also create an account in order to track your
            exercise history and keep tabs on your gym-going progress! Take a
            look at the additional info tab to find some helpful resources about
            the gym and working out, and to get access to an epic gym playlist!
          </p>
        </section>

        <section>
          <h1>General Healthy Workout tips:</h1>
          <ul className="noBulletPoints">
            <li>Listen to your body. Don't overlift!</li>
            <li>Stay hydrated. Water is important!</li>
            <li>Build in rest time. Your muscles need a break!</li>
            <li>You got this!!</li>
          </ul>
        </section>
      </div>
    );
  }
}

export default HomePage;
