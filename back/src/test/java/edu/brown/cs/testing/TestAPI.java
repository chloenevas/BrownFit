package edu.brown.cs.testing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


import edu.brown.cs.student.main.database.ApiRequest;
import edu.brown.cs.student.main.records.Exercise;
import java.io.IOException;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TestAPI {

  @BeforeEach
  public void setup(){

  }

  @AfterEach
  public void tearDown(){

  }

  @Test
  public void testConnection() throws IOException {

    ApiRequest request = new ApiRequest();
    List<Exercise> exercises = request.makeExerciseAPIRequest("biceps", "strength");
    assertNotNull(exercises);
    String name = "Incline Hammer Curls";
    String type = "strength";
    String muscle = "biceps";
    String equipment = "dumbbell";
    String difficulty = "beginner";
    String instructions = "Seat yourself on an incline bench with a dumbbell in each hand. "
        + "You should pressed firmly against he back with your feet together. "
        + "Allow the dumbbells to hang straight down at your side, holding them with a neutral grip. "
        + "This will be your starting position. Initiate the movement by flexing at the elbow, "
        + "attempting to keep the upper arm stationary. Continue to the top of the movement and pause, "
        + "then slowly return to the start position.";
    Exercise exercise = new Exercise(name, type, muscle, equipment, difficulty, instructions);
    assertEquals(exercises.get(0), exercise);
  }
}
