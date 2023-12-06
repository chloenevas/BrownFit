package edu.brown.cs.student.main.algorithm;

import edu.brown.cs.student.main.database.ApiRequest;
import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import edu.brown.cs.student.main.records.Exercise;
import edu.brown.cs.student.main.records.Machine;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import kotlin.collections.ArrayDeque;

public class ShortAlgo {
private HashMap<String, Object> returnMap;
private HashMap<String, Integer> durationMap;

// probably unnecessary
private HashMap<String, String> goalMap;
  private HashMap<String, Machine> database;


  public ShortAlgo(String duration, String muscle, String muscle2, String goal) throws IOException {
    NelsonMachineDatabase database = new NelsonMachineDatabase();
    this.database = database.getDatabase();
    this.returnMap = new HashMap<>();
    this.initializeDuration();
    this.generateWorkout(duration, muscle, muscle2, goal);
  }

  /**
   * Generates workout with tons of helper methods
   * @param duration
   * @param muscle
   * @param muscle2
   * @param goal
   * @throws IOException
   */
  private void generateWorkout(String duration, String muscle, String muscle2, String goal)
      throws IOException {

    int value = this.durationMap.get(duration);

    List<Machine> validMachines = new ArrayList<>();
    for(Machine machine: this.database.values()) {

      // checks if the machine contains the muscle targeted and adds to valid list
      if (contains(machine.muscles(), muscle)){
        validMachines.add(machine);
      }
    }
    for(int i = value; i > 0; i--){
      if (validMachines.isEmpty()){
        break;
      }
      Machine machine = this.selectExercise(validMachines);
      // need to add rep ranges and sets and then return
      value--;
      this.returnMap.put("Machine " + 1, machine);
    }

    // API request here for an exercise and add to map

    ApiRequest API = new ApiRequest();
    List<Exercise> APIlist= API.makeExerciseAPIRequest(muscle, goal);

    // adds as many API exercises as needed (almost always 1 unless we run out of machines
    for(int i = 0; i <value; i++) {
      Exercise exercise = APIlist.get((int) (Math.random() * APIlist.size()));

      // check that the exercise is not already in the list from the machines (bench press is in both)

      this.returnMap.put("API EXERCISE", exercise);
    }


  }

  /**
   * Given list of exercises which fit the criteria, randomly select an exercise and remove from the list
   * to avoid double picking. Need to add algorithmic complexity here.
   * @param machines
   * @return
   */
  private Machine selectExercise(List<Machine> machines){
    int num = machines.size();

    int rand = (int) (Math.random()*num);

    Machine returnMachine = machines.get(rand);
    machines.remove(rand);
    return returnMachine;
  }

  /**
   * Simple containment in an array
   * @param array
   * @param value
   * @return
   */
  private static boolean contains(String[] array, String value) {
    for (String element : array) {
      if (element.equals(value)) {
        return true;
      }
    }
    return false;
  }

  private void initializeDuration(){
    this.durationMap = new HashMap<>();
    // How do we want to allocate exercises depending on duration?
    this.durationMap.put("30 minutes or less", 2);
    this.durationMap.put("30-60", 4);
    this.durationMap.put("60-90", 6);
    this.durationMap.put("90-120", 7);
    this.durationMap.put("120 minutes or more", 8);
  }

//  private void initializeGoal(){
//    // How do we want to allocate exercises depending on duration?
//    this.goalMap.put("strengthen muscles", "strength");
//    this.goalMap.put("burn calories", "cardio");
//    this.goalMap.put("build muscles", 7);
//    this.goalMap.put("90-120", 8);
//    this.goalMap.put("120 minutes or more", 9);
//  }


  public Map<String, Object> getWorkout(){
    return this.returnMap;
  }



}
