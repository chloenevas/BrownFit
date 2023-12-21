package edu.brown.cs.student.main.records;

/**
 * A class that models an API returned free weight Exercise. These aer the components of our workouts that do not
 * use Nelson Machines and are instead given by an API
 *  @param name - name of exercise
 *  @param type - the type of exercise (in our terms, the goal of the exercise)
 *  @param muscle - the primary muscle trained by that exercise
 *  @param equipment - the equipment necessary for that exercise
 *  @param difficulty - the difficulty of the exercise
 *  @param instructions - a description of how to perform the exercise
 *
 */
public record Exercise(String name, String type, String muscle, String equipment, String difficulty, String instructions){
}
