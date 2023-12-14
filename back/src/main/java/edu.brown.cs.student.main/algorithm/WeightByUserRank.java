package edu.brown.cs.student.main.algorithm;

import edu.brown.cs.student.main.records.Machine;

import java.util.ArrayList;
import java.util.List;

/**
 * This class models a specific kind of listSorter that we currently think is best for our program. It weighs the
 * list of machines based off of how highly or poorly the user ranks that machine in their history, with 1 being a
 * negative rank, 5 being a high rank, and 3 being a neutral rank
 */
public class WeightByUserRank implements ListSorter {

    private String muscle2;
    private String history;

    public WeightByUserRank(String muscle2, String history){
        this.muscle2 = muscle2;
        this.history = history;

    }

    @Override
    public List<Machine> getWeightedMachineList(List<Machine> machines){
        return this.getListWeightedByUserRank(machines, this.muscle2, this.history);
    }



    /**
     * Converts a list of valid machines into a weighted list of machines by user preference. Public method for testing.
     * @param machines - list of valid machines
     * @param muscle2 - secondary muscle
     * @param history - account for user information
     * @return - returns a list of weighted machines to be selected for the workout
     */
    public List<Machine> getListWeightedByUserRank(List<Machine> machines, String muscle2, String history){
        int num = machines.size();

        //make a list of machine objects to track the weights of how probable it is we choose that machine
        //i.e., the more times that machine is added to the list, the more likely we are to pick it
        ArrayList<Machine> machineWeights = new ArrayList<>();

        for (Machine machine : machines) {
            //if machine contains secondary muscle, add it 5 times to return list
            if (contains(machine.getMuscle(), muscle2)) {
                for (int j = 0; j < 5; j++) {
                    machineWeights.add(machine);
                }
            }
            //if machine does not contain secondary muscle, only add it 3 times to return list
            else {
                for (int j = 0; j < 3; j++) {
                    machineWeights.add(machine);
                }
            }

            //if account is passed in and account has ranking for current machine
            if (!history.equals("") && history.contains(machine.getName())) {
                //gets index of the machine name
                int nameIndex = history.indexOf(machine.getName());
                //gets index of the corresponding rating (+1 since / separates rating)
                int ratingIndex = nameIndex + machine.getName().length()+1;
                String machineRating = history.substring(ratingIndex, ratingIndex+1);
                //gets user's rating of that machine and subtracts it by 3
                //subtract by 3 so that high ranking of 5 will get positive update value and
                // low ranking of 1 will get negative update value
                int weightUpdate = Integer.parseInt(machineRating) - 3;
                //if this difference is greater than 0, add that machine to the return list that many times
                if (weightUpdate >= 0) {
                    for (int j = 0; j < weightUpdate; j++) {
                        machineWeights.add(machine);
                    }
                }
                //if this difference is less than 0, remove that machine from the return list that many times
                //will never error since max subtractions is 2 and min occurrences in list is 3
                else {
                    for (int j = -weightUpdate; j > 0; j--) {
                        machineWeights.remove(machine);
                    }
                }
            }
        }
        //goal: return list of machines where prevalence of machine is correlated to how highly it is weighted
        return machineWeights;
    }

    private static boolean contains(String[] array, String value) {
        for (String element : array) {
            if (element.equals(value) || value.equals("full body") || value.equals("N/A")) {
                return true;
            }
        }
        return false;
    }
}
