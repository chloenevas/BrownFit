package edu.brown.cs.student.main.records;

public class Machine {

    private String name;
    private String img;
    private String instructions;
    private String[] muscle;
    private String weight;
    private String reps;

    public Machine(String name, String img, String instructions, String[] muscle){
        this.name = name;
        this.img = img;
        this.instructions = instructions;
        this.muscle = muscle;
        this.weight = "";
        this.reps = "";
    }

    public void setWeight(String weight){
        this.weight = weight;
    }

    public void setReps(String reps){
        this.reps = reps;
    }

    public String getWeight(){
        return String.valueOf(this.weight);
    }

    public String[] getMuscle(){
        return this.muscle.clone();
    }

    public String getName(){
        return String.valueOf(this.name);
    }

    public String getImg(){
        return String.valueOf(this.img);
    }
}
