package edu.brown.cs.student.main.records;

public class Exercise{

    private String name;
    private String type;
    private String muscle;
    private String equipment;
    private String difficulty;
    private String instructions;

    private String weight;

    private String reps;


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

    public void setWeights(String weight){
        this.weight = weight;
    }

    public void setReps(String reps){
        this.reps = reps;
    }



}
