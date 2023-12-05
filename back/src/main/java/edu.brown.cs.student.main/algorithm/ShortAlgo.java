package edu.brown.cs.student.main.algorithm;

import edu.brown.cs.student.main.database.ApiRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ShortAlgo {
private HashMap<String, Object> returnMap;
private HashMap<String, Integer> durationMap;

  public ShortAlgo(String duration, String muscle, String muscle2, String goal) throws IOException {
    this.returnMap = new HashMap<>();
    this.durationMap = new HashMap<>();
    this.initializeDuration();
    this.generateWorkout(duration, muscle, muscle2, goal);
  }

  private void generateWorkout(String duration, String muscle, String muscle2, String goal)
      throws IOException {

    int value = this.durationMap.get(duration);

    for(int i = 0; i < value; i++) {

      ApiRequest exercise = new ApiRequest();
      this.returnMap.put(String.valueOf(i+1), exercise.makeExerciseAPIRequest(muscle, "strength").get(0));

    }


  }

  private void initializeDuration(){
    // How do we want to allocate exercises depending on duration?
    this.durationMap.put("30 minutes or less", 3);
    this.durationMap.put("30-60", 5);
    this.durationMap.put("60-90", 7);
    this.durationMap.put("90-120", 8);
    this.durationMap.put("120 minutes or more", 9);
  }


  public Map<String, Object> getWorkout(){
    return this.returnMap;
  }



}
