package edu.brown.cs.student.main.database;


import edu.brown.cs.student.main.records.Exercise;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

/**
 * Interface for census data, with method getBroadband which takes in geolocation and returns census data
 */
public interface ExerciseAPI {

  List<Exercise> makeExerciseAPIRequest(String muscle, String goal) throws MalformedURLException, IOException;
}