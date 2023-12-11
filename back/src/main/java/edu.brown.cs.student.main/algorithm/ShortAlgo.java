package edu.brown.cs.student.main.algorithm;

import edu.brown.cs.student.main.database.ApiRequest;
import edu.brown.cs.student.main.database.MockAccount;
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
    private ArrayList<Object> returnList;
    private HashMap<String, Integer> durationMap;
    private HashMap<String, Machine> database;

    private HashMap<String, String> goalMap;

    // Updates/TODO
    // 1. Updated amount of exercises per workout to match the hashmap
    // update: I did this by limiting amount of apis that can be added and by adding muscles accoring to muscle2 as well
    // 2. Use testGenerateWorkout to fuzz test and you can add more thorough test assertions
        // to test more deeply all I have right now is assert size
    // 4. wrote a note about the switch boolean idea: not really necessary if we don't care
        // about a user getting less exercises than they requested but just an idea.
    //update: I fixed the N/A and full body options so that they implicitly match with any muscle


    public ShortAlgo() throws IOException {
        NelsonMachineDatabase database = new NelsonMachineDatabase();
        this.database = database.getDatabase();
        this.returnList = new ArrayList<>();
        this.initializeDuration();
        this.initializeGoal();
    }

    /**
     * Generates workout with tons of helper methods
     * @param duration
     * @param muscle
     * @param muscle2
     * @param goal
     * @throws IOException
     */

    public List<Object> generateWorkout(String duration, String muscle, String muscle2, String goal, MockAccount mock)
            throws IOException {

        this.returnList.clear();
        int workoutSize = this.durationMap.get(duration);

        List<Machine> validMachines = new ArrayList<>();
        for(Machine machine: this.database.values()) {

            // checks if the machine contains the muscle targeted and adds to valid list
            if (contains(machine.getMuscle(), muscle)){
                validMachines.add(machine);
            }
        }

        //adds as many valid machines to workout as possible (max = workoutSize - 1)
        addMachinesToWorkout(workoutSize, validMachines, muscle2, mock, goal);

        int emptySpaces = workoutSize - this.returnList.size();
        //if there are not that many machines we add by primary muscle, fill in blanks with secondary muscle
        //will only add empty spaces - 2 machines by this way
        if (emptySpaces >= 4){
            List<Machine> newValidMachines = new ArrayList<>();
            for(Machine machine: this.database.values()) {

                // checks if the machine contains the secondary muscle and is not in workout already and
                // adds to valid list
                if (contains(machine.getMuscle(), muscle2) && !this.returnList.contains(machine)){
                    newValidMachines.add(machine);
                }
            }
            addMachinesToWorkout(emptySpaces - 2, newValidMachines, muscle, mock, goal);
        }

        // API request here for an exercise and add to map

        ApiRequest API = new ApiRequest();
        String apiGoal;
        if (goal.equals("just get a good sweat in!") || goal.equals("burn calories")){
            apiGoal = "cardio";
        }
        else{
            apiGoal = "strength";
        }
        List<Exercise> APIlist= API.makeExerciseAPIRequest(muscle, apiGoal);
        if (APIlist.isEmpty()){
            return new ArrayList<>();
        }
        // adds as many API exercises as needed (almost always 1 unless we run out of machines

        // I want to use this to switch between primary and secondary muscle API calls
        // so that we can populate with more exercises in the event that the nelson does not
        // have enough exercises and our primary exercise is a small body part
        boolean switchBool = true;
        int emptySlotsAPI = workoutSize - this.returnList.size();
        for(int i = 0; i < emptySlotsAPI; i++) {
            Exercise exercise = APIlist.get((int) (Math.random() * APIlist.size()));

            // check that the exercise is not already in the list from the machines (bench press is in both)
            this.returnList.add(exercise);
            System.out.println("added API" + i);
        }
        System.out.println(this.returnList.size());

        return this.returnList;
    }

    public void addMachinesToWorkout(int workoutSize, List<Machine> validMachines, String muscle2, MockAccount mock, String goal){
        for(int i = workoutSize; i > 1; i--){
            if (validMachines.isEmpty()){
                break;
            }
            Machine machine = this.selectExercise(validMachines, muscle2, mock);
            switch (goal){
                case "strength":
                    machine.setWeight("higher");
                    machine.setReps("fewer: 4-8");
                    System.out.println(goal);
                    break;
                case "build muscles":
                    machine.setWeight("lower");
                    machine.setReps("more: 12-20");
                    System.out.println(goal);
                    break;
                default:
                    machine.setWeight("medium");
                    machine.setReps("medium: 8-12");
                    System.out.println(goal);
                    break;
            }
            validMachines.remove(machine);
            System.out.println(machine.getWeight());
            this.returnList.add(machine);
        }
    }

    /**
     * Given list of exercises which fit the criteria, randomly select an exercise and remove from the list
     * to avoid double picking. Need to add algorithmic complexity here.
     * @param machines
     * @return
     */

    public Machine selectExercise(List<Machine> machines, String muscle2, MockAccount mock){

        //gets random index in the list and returns that machine

        List<Machine> weightedMachines = this.getWeightedMachineList(machines, muscle2, mock);
        int rand = (int) (Math.random()*weightedMachines.size());
        Machine returnMachine = weightedMachines.get(rand);
        weightedMachines.remove(rand);
        return returnMachine;
    }

    public List<Machine> getWeightedMachineList(List<Machine> machines, String muscle2, MockAccount mock){
        int num = machines.size();

        //make a list of machine objects to track the weights of how probable it is we choose that machine
        //i.e., the more times that machine is added to the list, the more likely we are to pick it
        ArrayList<Machine> machineWeights = new ArrayList<>();

        for (int i = 0; i < num; i++){
            //if machine contains secondary muscle, add it 5 times to return list
            if (contains(machines.get(i).getMuscle(), muscle2)){
                for (int j = 0; j <5; j++){
                    machineWeights.add(machines.get(i));
                }
            }
            //if machine does not contain secondary muscle, only add it 3 times to return list
            else{
                for (int j = 0; j <3; j++){
                    machineWeights.add(machines.get(i));
                }
            }

            //if account has ranking for current machine
            if (mock.machineRatings().containsKey(machines.get(i))){
                //gets user's rating of that machine and subtracts it by 3
                //subtract by 3 so that high ranking of 5 will get positive update value and
                // low ranking of 1 will get negative update value
                int weightUpdate = mock.machineRatings().get(machines.get(i)) - 3;
                //if this difference is greater than 0, add that machine to the return list that many times
                if (weightUpdate >= 0){
                    for (int j = 0; j < weightUpdate; j++){
                        machineWeights.add(machines.get(i));
                    }
                }
                //if this difference is less than 0, remove that machine from the return list that many times
                //will never error since max subtractions is 2 and min occurrences in list is 3
                else{
                    for (int j = -weightUpdate; j > 0; j--){
                        machineWeights.remove(machines.get(i));
                    }
                }
            }
        }
        //goal: return list of machines where prevalance of machine is correlated to how highly it is weighted
        return machineWeights;
    }

    /**
     * Simple containment in an array plus fact that it will always return true if muscle is noted as full body or N/A
     * this is so any exercise could be matched with one of these values
     * @param array
     * @param value
     * @return
     */
    private static boolean contains(String[] array, String value) {
        for (String element : array) {
            if (element.equals(value) || value.equals("full body") || value.equals("N/A")) {
                return true;
            }
        }
        return false;
    }

    private void initializeDuration(){
        this.durationMap = new HashMap<>();
        // How do we want to allocate exercises depending on duration?
        this.durationMap.put("30 minutes or less", 3);
        this.durationMap.put("30-60 minutes", 5);
        this.durationMap.put("60-90 minutes", 7);
        this.durationMap.put("90-120 minutes", 8);
        this.durationMap.put("120 minutes or more", 9);
    }

    public Map<String, Integer> getDurationMap(){
        return this.durationMap;
    }

  private void initializeGoal(){
//    How do we want to allocate exercises depending on duration?
//    this.goalMap.put("strengthen muscles", "strength");
//    this.goalMap.put("burn calories", "cardio");
//    this.goalMap.put("build muscles", "7");
//    this.goalMap.put("increase muscle endurance", "8");
//    this.goalMap.put("just get a good sweat in!", "9");
  }
}

