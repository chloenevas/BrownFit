import "../styles/App.css";
import "../styles/Workout.css";
import { ReactElement, useEffect, useState } from "react";
import HomePage from "./home/home";
import basicWorkoutPage from "./generator/basicWorkoutPage";
import machinePage from "./machines/machinePage";
import progressPage from "./progress/progressPage";

/**
 * This returns a basic template/outline for each of out pages (the title and buttons on the side)
 */
export default function App() {
  //this is a state variable/setter used to change the content of the page depending on which button is clicked
  const [pageContent, setPageContent] = useState<ReactElement>();

  //these are state variables/setters for each button that change which color the button is
  const [homeButtonColor, setHomeButtonColor] = useState<string>("Red");
  const [workoutButtonColor, setWorkoutButtonColor] =
    useState<string>("#453131");
  const [machineButtonColor, setMachineButtonColor] =
    useState<string>("#453131");
  const [progressButtonColor, setProgressButtonColor] =
    useState<string>("#453131");
  const [loginButtonColor, setLoginButtonColor] =
    useState<string>("#fff0e0");

  // tracking key pressing for zooming
  useEffect(() => {
    setPageContent(HomePage());
    const detectKeyDown = (e: { key: string }) => {
      //if someone is pressing down shift, we are zooming in
      if (e.key === "CapsLock") {
        console.log("CapsLock is pressed. Calling zoom-in function...");
        document.body.style.fontSize = `${
          parseInt(getComputedStyle(document.body).fontSize) + 2
        }px`;
        // if someone is pressing down control, we are zooming out
      } else if (e.key === "Control") {
        console.log("Ctrl key pressed. Calling zoom-out function...");
        document.body.style.fontSize = `${
          parseInt(getComputedStyle(document.body).fontSize) - 2
        }px`;
      }
    };

    document.addEventListener("keydown", detectKeyDown, true);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("keydown", detectKeyDown, true);
    };
  }, []);

  //function invoked when homebutton is clicked
  function handleHomeButtonClick() {
    //sets the page's content to the home page content
    setPageContent(HomePage());
    //sets the home button to red and everythign else to Brown
    setHomeButtonColor("Red");
    setWorkoutButtonColor("#453131");
    setMachineButtonColor("#453131");
    setProgressButtonColor("#453131");
    return undefined;
  }

  function handleWorkoutButtonClick() {
    setPageContent(basicWorkoutPage());

    //sets the workout button to red and everythign else to Brown
    setWorkoutButtonColor("Red");
    setHomeButtonColor("#453131");
    setMachineButtonColor("#453131");
    setProgressButtonColor("#453131");
    return undefined;
  }

  function handleMachineButtonClick() {
    setPageContent(machinePage());

    //sets the machine button to red and everythign else to Brown
    setMachineButtonColor("Red");
    setHomeButtonColor("#453131");
    setWorkoutButtonColor("#453131");
    setProgressButtonColor("#453131");
    return undefined;
  }

  function handleProgressButtonClick() {
    setPageContent(progressPage());

    //sets the progress button to red and everythign else to Brown
    setProgressButtonColor("Red");
    setHomeButtonColor("#453131");
    setWorkoutButtonColor("#453131");
    setMachineButtonColor("#453131");
    return undefined;
  }

  function handleLoginButtonClick() {
    // setPageContent(progressPage());
    // call authentication here

    //sets the login button to red 
    setLoginButtonColor("Red");
    return undefined;
  }

  return (
    <div className="App">
      <p className="App-header">
        <button
          className="App-header-login"
          aria-label="login button"
          style={{ backgroundColor: loginButtonColor }}
          onClick={() => handleLoginButtonClick()}
        >
          Login
        </button>
        <h1 className="App-header-title">BrownFit</h1>
      </p>
      <button
        className="Navigation-Button"
        aria-label="home button"
        style={{ backgroundColor: homeButtonColor }}
        onClick={() => handleHomeButtonClick()}
      >
        Home:
      </button>
      <button
        className="Navigation-Button"
        aria-label="workout button"
        style={{ backgroundColor: workoutButtonColor }}
        onClick={() => handleWorkoutButtonClick()}
      >
        Generate Workout:
      </button>
      <button
        className="Navigation-Button"
        aria-label="machine button"
        style={{ backgroundColor: machineButtonColor }}
        onClick={() => handleMachineButtonClick()}
      >
        Nelson Machines:
      </button>
      <button
        className="Navigation-Button"
        aria-label="progress button"
        style={{ backgroundColor: progressButtonColor }}
        onClick={() => handleProgressButtonClick()}
      >
        Check Progress:
      </button>
      {/* this is where the content of the page changes*/}
      <div>{pageContent}</div>
    </div>
  );
}
