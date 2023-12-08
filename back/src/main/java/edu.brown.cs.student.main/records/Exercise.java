package edu.brown.cs.student.main.records;

public record Exercise(String name, String type, String muscle, String equipment, String difficulty, String instructions) implements WorkoutElement{

    @Override
    public String getImg(){
        return "";
    }
}
