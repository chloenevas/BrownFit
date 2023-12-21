package edu.brown.cs.student.main.algorithm;

import edu.brown.cs.student.main.database.ApiRequest;
import edu.brown.cs.student.main.database.ExerciseAPI;
import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import edu.brown.cs.student.main.records.Exercise;
import edu.brown.cs.student.main.records.Machine;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Algorithm for the project which generates a workout for a given set of parameters passed into the generate workout
 * method.
 */
public class Algorithm {
    private HashMap<String, Integer> durationMap;
    private HashMap<String, Machine> database;
    private ExerciseAPI API;

    private ListSorter weighMachines;

    /**
     * Constructor initializes the nelson database and sets up database and also initializes the duration hashmap,
     * which maps front end queries to number of exercises in the workout.
     * @param weighMachines the listSorter object that specifies how the algorithm should pick machines
     * @throws IOException - Throws IO exception from machine database, which should never be called because we created
     * the database and know that no error is produced but handled in case.
     */
    public Algorithm(ListSorter weighMachines, HashMap<String, Machine> database, ExerciseAPI API) throws IOException {
        this.database = database;
        this.API = API;
        this.initializeDuration();
        this.weighMachines = weighMachines;
    }

    /**
     *  Generates a workout with the given query parameters from the front end passed to the handler. Parameters explained
     *  below. Returns a list of objects, which are either nelson machine exercises (Machine) or API free weight
     *  exercises (Exercise). Called in workout handler and is main algorithmic complexity function. For more info on these
     *  parameters, read the read me, workout handler class, and the front end query parameters. Many defensive program
     *  measures were taken that are unnecessary due to the rigidity of the calls to the server from the front end.
     * @param duration - duration for the workout to last
     * @param muscle - primary muscle targeted by workout
     * @param muscle2 - secondary muscle targeted by workout
     * @param goal - goal of the workout
     * @param userWorkoutHistory - string model of user's workout history - includes machines and their ratings
     * @return - returns a list of machines and exercises, which is a full workout
     * @throws IOException - throws exception if API can not be properly connected to. API Ninjas returns empty sets
     * for malformed URLs, so should not ever be thrown
     */

    public List<Object> generateWorkout(String duration, String muscle, String muscle2, String goal, String userWorkoutHistory)
            throws IOException {

        List<Object> returnList = new ArrayList<>();

        int workoutSize = this.durationMap.get(duration);

        List<Machine> validMachines = new ArrayList<>();
        for(Machine machine: this.database.values()) {

            // checks if the machine contains the muscle targeted and adds to valid list
            if (contains(machine.getMuscle(), muscle)){
                validMachines.add(machine);
            }
        }

        //adds as many valid machines to workout as possible (max = workoutSize - 1)
        addMachinesToWorkout(returnList, workoutSize, validMachines, muscle2, userWorkoutHistory, goal);

        int emptySpaces = workoutSize - returnList.size();
        //if there are not that many machines we add by primary muscle, fill in blanks with secondary muscle
        //will only add empty spaces - 2 machines by this way
        if (emptySpaces >= 4){
            List<Machine> newValidMachines = new ArrayList<>();
            for(Machine machine: this.database.values()) {

                // checks if the machine contains the secondary muscle and is not in workout already and
                // adds to valid list
                if (contains(machine.getMuscle(), muscle2) && !returnList.contains(machine)){
                    newValidMachines.add(machine);
                }
            }
            addMachinesToWorkout(returnList, emptySpaces - 2, newValidMachines, muscle, userWorkoutHistory, goal);
        }

        // Calls API for the target muscle and goal
        String apiGoal;
        if (goal.equals("just get a good sweat in!") || goal.equals("burn calories")){
            apiGoal = "cardio";
        }
        else{
            apiGoal = "strength";
        }
        List<Exercise> APIlist= this.API.makeExerciseAPIRequest(muscle, apiGoal);
        if (APIlist.isEmpty()){
            return new ArrayList<>();
        }

        // adds remaining slots for workout from the API
        int emptySlotsAPI = workoutSize - returnList.size();
        for(int i = 0; i < emptySlotsAPI; i++) {
            Exercise exercise = APIlist.get((int) (Math.random() * APIlist.size()));
            if (returnList.contains(exercise)){
                i--;
            }
            else{
                returnList.add(exercise);
            }
        }

        return returnList;
    }

    /**
     * Helper function called in generate workout to add a machine to the return list. Takes a list of
     * exercises which match the given query and the size of the workout and add machines to the list accordingly.
     * @param returnList - list to add machines to, returned as the final workout in generate workout
     * @param workoutSize - number of exercises that need to still be added to the workout
     * @param validMachines - list of valid machines for the current query
     * @param muscle2 - secondary muscle of the workout
     * @param history - user's machine history information
     * @param goal - goal for the workout
     */
    public void addMachinesToWorkout(List<Object> returnList, int workoutSize, List<Machine> validMachines, String muscle2, String history, String goal){
        for(int i = workoutSize; i > 1; i--){
            if (validMachines.isEmpty()){
                break;
            }
            Machine machine = this.selectExercise(validMachines);
            switch (goal){
                case "strengthen muscles":
                    machine.setWeight("higher");
                    machine.setReps("fewer: 4-8");
                    break;
                case "build muscles":
                    machine.setWeight("lower");
                    machine.setReps("more: 12-20");
                    break;
                default:
                    machine.setWeight("medium");
                    machine.setReps("medium: 8-12");
                    break;
            }
            validMachines.remove(machine);
            returnList.add(machine);
        }
    }

    /**
     * Given list of exercises which fit the criteria, get the weighted list of the machines and randomly pick an
     * exercise from the list. Weighted list takes into account the preference rankings of a user. Method is
     * public to test selection of exercises is weighted properly.
     * @param machines - list of valid machine
     * @return - returns the machine that was selected
     */

    public Machine selectExercise(List<Machine> machines){

        //gets random index in the list and returns that machine

        List<Machine> weightedMachines = this.weighMachines.getWeightedMachineList(machines);;
        int rand = (int) (Math.random()*weightedMachines.size());
        Machine returnMachine = weightedMachines.get(rand);
        weightedMachines.remove(rand);
        return returnMachine;
    }


    /**
     * Simple containment in an array plus fact that it will always return true if muscle is noted as full body or N/A
     * this is so any exercise could be matched with one of these values. Used to see if muscle is contained
     * in the array of muscles targeted by an exercise
     * @param array - array to check containment
     * @param value - value to check if contained
     * @return - true if in array or full body or N/A, false otherwise
     */
    private static boolean contains(String[] array, String value) {
        for (String element : array) {
            if (element.equals(value) || value.equals("full body") || value.equals("N/A")) {
                return true;
            }
        }
        return false;
    }

    /**
     * Initializes the duration map. Map is used to get number of exercises from front end queries
     */
    private void initializeDuration(){
        this.durationMap = new HashMap<>();
        this.durationMap.put("30 minutes or less", 3);
        this.durationMap.put("30-60 minutes", 5);
        this.durationMap.put("60-90 minutes", 7);
        this.durationMap.put("90-120 minutes", 8);
        this.durationMap.put("120 minutes or more", 9);
    }
    /**
     * Get duration map for testing
     * @return - clone of duration map
     */
    public Map<String, Integer> getDurationMap(){
        return (Map<String, Integer>) this.durationMap.clone();
    }

}

