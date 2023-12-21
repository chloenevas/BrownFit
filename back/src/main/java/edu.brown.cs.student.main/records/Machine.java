package edu.brown.cs.student.main.records;

/**
 * A class modeling a Machine at the Nelson.
 */
public class Machine {

    private String name;
    private String img;
    private String instructions;
    private String[] muscle;
    private String weight;
    private String reps;

    /**
     * @param name - the name of the machine
     * @param img - the image path of that machine
     * @param instructions - a description of how to use that machine
     * @param muscle - a list of the muscles exercsied by that machine
     */
    public Machine(String name, String img, String instructions, String[] muscle){
        this.name = name;
        this.img = img;
        this.instructions = instructions;
        this.muscle = muscle;
        this.weight = "";
        this.reps = "";
    }

    /**
     * a setter for the weight field, used to set the relative weight amount for that machine based on workout goal
     */
    public void setWeight(String weight){
        this.weight = weight;
    }

    /**
     * a setter for the reps field, used to set the relative rep amount for that machine based on workout goal
     */
    public void setReps(String reps){
        this.reps = reps;
    }

    /**
     * a getter for the muscle field
     */
    public String[] getMuscle(){
        return this.muscle.clone();
    }

    /**
     * a getter for the name field
     */
    public String getName(){
        return String.valueOf(this.name);
    }
}