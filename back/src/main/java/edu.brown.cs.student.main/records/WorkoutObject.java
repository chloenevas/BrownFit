package edu.brown.cs.student.main.records;

public class WorkoutObject extends Object{

    private String name;
    private WorkoutElement element;
    public WorkoutObject(String name, WorkoutElement workoutElement){
        this.name = name;
        this.element = workoutElement;
    }

    public String getName(){
        return String.valueOf(name);
    }

    public WorkoutElement getElement(){
        return this.element;
    }

}
