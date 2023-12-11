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

/**
 * Algorithm for the project which generates a workout for a given set of parameters passed into the generate workout
 * method.
 */
public class Algorithm {
    private HashMap<String, Integer> durationMap;
    private HashMap<String, Machine> database;

    /**
     * Constructor initializes the nelson database and sets up database and also initializes the duration hashmap,
     * which maps front end queries to number of exercises in the workout.
     * @throws IOException - Throws IO exception from machine database, which should never be called because we created
     * the database and know that no error is produced but handled in case.
     */
    public Algorithm() throws IOException {
        NelsonMachineDatabase database = new NelsonMachineDatabase();
        this.database = database.getDatabase();
        this.initializeDuration();
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
     * @param mock - account of user
     * @return - returns a list of machines and exercises, which is a full workout
     * @throws IOException - throws exception if API can not be properly connected to. API Ninjas returns empty sets
     * for malformed URLs, so should not ever be thrown
     */

    public List<Object> generateWorkout(String duration, String muscle, String muscle2, String goal, MockAccount mock)
            throws IOException {

        List<Object> returnList = new ArrayList<>();
        int workoutSize = this.durationMap.get(duration);

        List<Machine> validMachines = new ArrayList<>();
        for(Machine machine: this.database.values()) {

            // checks if the machine contains the muscle targeted and adds to valid list
            if (contains(machine.muscle(), muscle)){
                validMachines.add(machine);
            }
        }

        //adds as many valid machines to workout as possible (max = workoutSize - 1)
        addMachinesToWorkout(returnList, workoutSize, validMachines, muscle2, mock);

        int emptySpaces = workoutSize - returnList.size();
        //if there are not that many machines we add by primary muscle, fill in blanks with secondary muscle
        //will only add empty spaces - 2 machines by this way
        if (emptySpaces >= 4){
            List<Machine> newValidMachines = new ArrayList<>();
            for(Machine machine: this.database.values()) {

                // checks if the machine contains the secondary muscle and is not in workout already and
                // adds to valid list
                if (contains(machine.muscle(), muscle2) && !returnList.contains(machine)){
                    newValidMachines.add(machine);
                }
            }
            addMachinesToWorkout(returnList, emptySpaces - 2, newValidMachines, muscle, mock);
        }

        // API request here for an exercise and add to map

        ApiRequest API = new ApiRequest();
        List<Exercise> APIlist= API.makeExerciseAPIRequest(muscle, goal);
        if (APIlist.isEmpty()){
            return new ArrayList<>();
        }
        // adds as many API exercises as needed (almost always 1 unless we run out of machines

        // I want to use this to switch between primary and secondary muscle API calls
        // so that we can populate with more exercises in the event that the nelson does not
        // have enough exercises and our primary exercise is a small body part
        boolean switchBool = true;
        int emptySlotsAPI = workoutSize - returnList.size();
        for(int i = 0; i < emptySlotsAPI; i++) {
            Exercise exercise = APIlist.get((int) (Math.random() * APIlist.size()));

            // check that the exercise is not already in the list from the machines (bench press is in both)
            returnList.add(exercise);
        }

        return returnList;
    }

    /**
     *
     * @param workoutSize
     * @param validMachines
     * @param muscle2
     * @param mock
     */
    public void addMachinesToWorkout(List<Object> returnList, int workoutSize, List<Machine> validMachines,
        String muscle2, MockAccount mock){
        for(int i = workoutSize; i > 1; i--){
            if (validMachines.isEmpty()){
                break;
            }
            Machine machine = this.selectExercise(validMachines, muscle2, mock);
            // need to add rep ranges and sets and then return
            validMachines.remove(machine);
            returnList.add(machine);
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
            if (contains(machines.get(i).muscle(), muscle2)){
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
        //goal: return list of machines where prevalence of machine is correlated to how highly it is weighted
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
        this.durationMap.put("30 minutes or less", 3);
        this.durationMap.put("30-60 minutes", 5);
        this.durationMap.put("60-90 minutes", 7);
        this.durationMap.put("90-120 minutes", 8);
        this.durationMap.put("120 minutes or more", 9);
    }

    public Map<String, Integer> getDurationMap(){
        return (Map<String, Integer>) this.durationMap.clone();
    }

}

