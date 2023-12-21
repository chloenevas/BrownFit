package edu.brown.cs.student.main.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.algorithm.Algorithm;
import edu.brown.cs.student.main.algorithm.ListSorter;
import edu.brown.cs.student.main.algorithm.WeightByUserRank;
import edu.brown.cs.student.main.database.ExerciseAPI;
import edu.brown.cs.student.main.records.Machine;
import java.util.HashMap;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Class called by server to generate a workout
 */
public class WorkoutHandler implements Route {

    private ExerciseAPI API;
    private HashMap<String, Machine> database;
    public WorkoutHandler(HashMap<String, Machine> database, ExerciseAPI API) {
        this.API = API;
        this.database = database;
    }

    /**
     * Handle method overriden from route which calls generate workout from the algorithm class. Requests
     * query parameters and uses moshi to serialize data.
     */
    @Override
    public Object handle(Request request, Response response) throws IOException {
        response.header("Access-Control-Allow-Origin", "*");
        Moshi moshi = new Moshi.Builder().build();
        Type listObject = Types.newParameterizedType(List.class, Object.class);
        JsonAdapter<List<Object>> adapter = moshi.adapter(listObject);

        List<String> durationList = new ArrayList<>();
        String[] dummyDur = new String[]{"30 minutes or less", "30-60 minutes", "60-90 minutes",
                "90-120 minutes", "120 minutes or more"};
        Collections.addAll(durationList, dummyDur);
        List<String> muscleList=new ArrayList<>();
        String[] dummyMusc = new String[]{"full body", "calves", "quads", "hamstrings",
                "triceps", "biceps", "chest", "shoulders", "upper back", "lower back",
                "delts", "glutes", "abdominals", "N/A"};
        Collections.addAll(muscleList, dummyMusc);
        List<String> goalList=new ArrayList<>();
        String[] dummyGoals = new String[]{"strengthen muscles", "increase muscle endurance",
                "build muscles", "burn calories", "just get a good sweat in!"};
        Collections.addAll(goalList, dummyGoals);



        try{
            // parameters for the server call
            String duration = request.queryParams("duration");
            String muscle1 = request.queryParams("muscle1");
            String muscle2 = request.queryParams("muscle2");
            String goal = request.queryParams("goal");
            String userWorkoutHistory = request.queryParams("history");


            // null/input checking, should never occur due to rigidity of front end calls
            if (duration == null || !durationList.contains(duration)) {
                throw new InvalidInputException("Invalid input: invalid or missing duration field. Duration = " + duration);
            }
            if (muscle1 == null || !muscleList.contains(muscle1)){
                throw new InvalidInputException("Invalid input: invalid or missing muscle1 field. Muscle1 = " + muscle1);
            }
            if (muscle2 == null || !muscleList.contains(muscle2)){
                throw new InvalidInputException("Invalid input: invalid or missing muscle2 field. Muscle2 = " + muscle2);
            }
            if (goal == null || !goalList.contains(goal)){
                throw new InvalidInputException("Invalid input: invalid or missing goal field. Goal = " + goal);
            }
            if (userWorkoutHistory == ""){
                userWorkoutHistory = "";
            }

            //creates specific weightByUserRank instance of listSorter interface
            ListSorter weighByUserRank = new WeightByUserRank(muscle2, userWorkoutHistory);


            // calls algorithm to make workout whose exercises are chosen based on the dependency injected listSorter
            //since our sorter chooses machines based off of user rank, this algorithm instance will do the same
            System.out.println(this.database);
            Algorithm algo = new Algorithm(weighByUserRank, this.database, this.API);
            List<Object> returnMap = algo.generateWorkout(duration, muscle1, muscle2, goal, userWorkoutHistory);
            return adapter.toJson(returnMap);
        }
        catch (InvalidInputException e){
            return e.getMessage();
        }
    }
}