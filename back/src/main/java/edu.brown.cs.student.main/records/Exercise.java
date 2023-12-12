package edu.brown.cs.student.main.records;

/**
 * A class that models an API returned free weight Exerice. These aer the components of our workouts that do not
 * use Nelson Machines and are instead given by an API
 */
public class Exercise{

    private String name;
    private String type;
    private String muscle;
    private String equipment;
    private String difficulty;
    private String instructions;

    private String weight;

    private String reps;


    /**
     * @param name - name of exercise
     * @param type - the type of exercise (in our terms, the goal of the exercise)
     * @param muscle - the primary muscle trained by that exercise
     * @param equipment - the equipment necessary for that exercise
     * @param difficulty - the difficulty of the exercise
     * @param instructions - a description of how to perform the exercise
     */
    public Exercise(String name, String type, String muscle, String equipment, String difficulty, String instructions){
        this.name = name;
        this.type = type;
        this.muscle = muscle;
        this.equipment = equipment;
        this.difficulty = difficulty;
        this.instructions = instructions;
        this.weight = "";
        this.reps = "";
    }

    /**
     * a setter for the weight field, will be used if we update program to create weights/reps for selected exercises
     */
    public void setWeights(String weight){
        this.weight = weight;
    }

    /**
     * a setter for the reps field, will be used if we update program to create weights/reps for selected exercises
     */
    public void setReps(String reps){
        this.reps = reps;
    }



}
