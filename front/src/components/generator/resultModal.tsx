import { mock } from "node:test";
import { useState } from "react";

import "../../styles/login.css";
//import {BrownLogo} from "../

export interface InputProps {
  durationValue: string;
  muscleValue: string;
  muscleValue2: string;
  goalValue: string;
  modalVisibility: string;
  setModalVisibility: React.Dispatch<React.SetStateAction<string>>;
}

export default function RESULTMODAL({
  durationValue,
  muscleValue,
  muscleValue2,
  goalValue,
  modalVisibility,
  setModalVisibility,
}: InputProps) {

  //TODO: make call to backend and retrieve json with exercises
  // Go through json and extract name, image, and instructions for each exercise
  // add each to a list? map? tbd doesn't really matter

  const exerciseMap = new Map<string, [string, string]>();

  
  // const mockExercises: string[] = [
  //   "Leg Press",
  //   "Treadmill",
  //   "Ab crunch",
  // ];

  exerciseMap.set('Leg Press',
    ['/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/legPress.png',
      
      "Sit down on the leg press machine and place your legs on the platform in front of you, with your feet approximately " +
      "a foot to one and half feet apart.\n Lower the safety bars holding the platform in place.Press the platform all the way " +
      "up until your legs are fully extended, without locking your knees.\nAs you inhale, slowly lower the platform until your upper " +
      "and lower legs make a 90 - degree angle.\nPush with the heels of your feet and use your quadriceps to go back to the starting " +
      "position.Exhale as you do so.\nRepeat for the number of reps in your set.Make sure that the safety pins are locked properly once you have finished."])

  exerciseMap.set("Treadmill", [
    "/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/treadmill.png",
    "Step onto the treadmill and select the speed and incline that you'd like to use. \nWarm up with a slower speed and then work your " +
    "way up to a higher speed.\nAfter you've completed your goal time/distance, either stop the treadmill or gradually slow your speed down until you come to a stop."]);
  
  exerciseMap.set("Ab crunch", [
    "/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/abCrunch.png",
    "Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles. Your arms " +
    "should be bent at a 90 degree angle as you rest the triceps on the pads provided. This will be your starting position.\nAt the same time, begin " +
    "to lift the legs up as you crunch your upper torso. Breathe out as you perform this movement. Tip: Be sure to use a slow and controlled motion. " +
    "Concentrate on using your abs to move the weight while relaxing your legs and feet.\nAfter a second pause, slowly return to the starting position " +
    "as you breathe in.\nRepeat the movement for the prescribed amount of repetitions."
  ]);
  
  // const mockExercises: exerciseMap = {
  //   "Leg Press": [
  //     "/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/legPress.png",
  //     "Sit down on the leg press machine and place your legs on the platform in front of you, with your feet approximately " +
  //       "a foot to one and half feet apart.\n Lower the safety bars holding the platform in place.Press the platform all the way " +
  //       "up until your legs are fully extended, without locking your knees.\nAs you inhale, slowly lower the platform until your upper " +
  //       "and lower legs make a 90 - degree angle.\nPush with the heels of your feet and use your quadriceps to go back to the starting " +
  //       "position.Exhale as you do so.\nRepeat for the number of reps in your set.Make sure that the safety pins are locked properly once you have finished.",
  //   ],
  //   "Treadmill": [
  //     "/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/treadmill.png",
  //     "Step onto the treadmill and select the speed and incline that you'd like to use. \nWarm up with a slower speed and then work your " +
  //       "way up to a higher speed.\nAfter you've completed your goal time/distance, either stop the treadmill or gradually slow your speed down until you come to a stop.",
  //   ],
  //   "Ab crunch": [
  //     "/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/abCrunch.png",
  //     "Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles. Your arms " +
  //       "should be bent at a 90 degree angle as you rest the triceps on the pads provided. This will be your starting position.\nAt the same time, begin " +
  //       "to lift the legs up as you crunch your upper torso. Breathe out as you perform this movement. Tip: Be sure to use a slow and controlled motion. " +
  //       "Concentrate on using your abs to move the weight while relaxing your legs and feet.\nAfter a second pause, slowly return to the starting position " +
  //       "as you breathe in.\nRepeat the movement for the prescribed amount of repetitions."]
  
  // };

  const mockImages: string[] = [
    "/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/legPress.png",
    "/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/treadmill.png",
    "/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/data/nelsonMachines/abCrunch.png",
  ];

  const mockInstructions: string[] = [
    'Sit down on the leg press machine and place your legs on the platform in front of you, with your feet approximately ' +
    'a foot to one and half feet apart.\n Lower the safety bars holding the platform in place.Press the platform all the way ' +
    'up until your legs are fully extended, without locking your knees.\nAs you inhale, slowly lower the platform until your upper ' +
    'and lower legs make a 90 - degree angle.\nPush with the heels of your feet and use your quadriceps to go back to the starting ' +
    'position.Exhale as you do so.\nRepeat for the number of reps in your set.Make sure that the safety pins are locked properly once you have finished.',

    "Step onto the treadmill and select the speed and incline that you'd like to use. \nWarm up with a slower speed and then work your " +
    "way up to a higher speed.\nAfter you've completed your goal time/distance, either stop the treadmill or gradually slow your speed down until you come to a stop.",

    "Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles. Your arms " +
    "should be bent at a 90 degree angle as you rest the triceps on the pads provided. This will be your starting position.\nAt the same time, begin " +
    "to lift the legs up as you crunch your upper torso. Breathe out as you perform this movement. Tip: Be sure to use a slow and controlled motion. " +
    "Concentrate on using your abs to move the weight while relaxing your legs and feet.\nAfter a second pause, slowly return to the starting position " +
    "as you breathe in.\nRepeat the movement for the prescribed amount of repetitions."

  ]

  function handleCloseClick() {
    setModalVisibility("none");
    return undefined;
  }

  {
    return (
      <div>
        <div className="workout-modal" style={{ display: modalVisibility }}>
          <span className="close-button" onClick={() => handleCloseClick()}>
            &times;
          </span>
          <div className="modal-content">
            <div>
              <p>Duration: {durationValue}</p>
              <p>Muscle 1: {muscleValue}</p>
              <p>Muscle 2: {muscleValue2}</p>
              <p>Goal: {goalValue}</p>
            </div>
            <div>
              {Array.from(exerciseMap).map(([key, value]) => (
                <div key={key}>
                  <p>{key}</p>
                  <img
                    src={value[0]}
                    alt={`Image for ${key}`}
                    style={{
                      width: "100px", // Adjust the width of the image as needed
                      height: "100px", // Adjust the height of the image as needed
                    }}
                  />

                  <p>{value[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
