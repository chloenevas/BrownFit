package edu.brown.cs.testing;

import edu.brown.cs.student.main.database.ExerciseAPI;
import edu.brown.cs.student.main.records.Exercise;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

public class MockAPI implements ExerciseAPI {

  @Override
  public List<Exercise> makeExerciseAPIRequest(String muscle, String goal)
      throws MalformedURLException, IOException {
    String name = "Incline Hammer Curls";
    String type = "strength";
    String muscle2 = "biceps";
    String equipment = "dumbbell";
    String difficulty = "beginner";
    String instructions = "Seat yourself on an incline bench with a dumbbell in each hand. "
        + "You should pressed firmly against he back with your feet together. "
        + "Allow the dumbbells to hang straight down at your side, holding them with a neutral grip. "
        + "This will be your starting position. Initiate the movement by flexing at the elbow, "
        + "attempting to keep the upper arm stationary. Continue to the top of the movement and pause, "
        + "then slowly return to the start position.";
    Exercise mockedExercise = new Exercise(name, type, muscle2, equipment, difficulty, instructions);
    List<Exercise> mockList = new ArrayList<>();
    mockList.add(mockedExercise);
    return mockList;
  }
}
