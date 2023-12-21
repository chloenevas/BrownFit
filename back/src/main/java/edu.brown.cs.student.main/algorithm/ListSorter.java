package edu.brown.cs.student.main.algorithm;

import edu.brown.cs.student.main.records.Machine;
import java.util.List;


/**
 * This is an interface modelling generic listSorting objects. These objects can be made and passed into the
 * Algorithm class in order to specify how machines should be chosen by the algorithm. Currently, we only have
 * the weightByUserRank Class implementing this interface, which tells the algorithm to pick machines for the workout
 * based off of a mix of muscle targeting and userRanking of machines. However, other implementations could specify
 * that the algo should pick machines based on time since last workout, only muscle targeting, inverse ranking, etc.
 * So, using this interface allows us to practice the strategy pattern and, in the future, try out different sorting
 * patterns based off of user feedback.
 */
public interface ListSorter {

    /**
     * Method implemented by all listSorters that takes in a list of machines and returns a weighted list of those
     * machines based off of some specified criteria
     * @param machines - a list of machines
     * @return - a weighted list of machines that the algo can pick from to make workouts
     */
    public List<Machine> getWeightedMachineList(List<Machine> machines);
}
