package edu.brown.cs.student.main.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.algorithm.Algorithm;
import edu.brown.cs.student.main.algorithm.ListSorter;
import edu.brown.cs.student.main.algorithm.WeightByUserRank;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

/**
 * Class called by server to generate a workout
 */
public class WorkoutHandler implements Route {

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
        try{
            // parameters for the server call
            String duration = request.queryParams("duration");
            String muscle1 = request.queryParams("muscle1");
            String muscle2 = request.queryParams("muscle2");
            String goal = request.queryParams("goal");
            String userWorkoutHistory = request.queryParams("history");

            // null checking, should never occur due to rigidity of front end calls
            if (duration == null || muscle1 == null || muscle2 == null || goal == null){
                throw new InvalidInputException("Invalid inputs. Missing duration, muscle, or goal field");
            }
            if (userWorkoutHistory == null){
                userWorkoutHistory = "";
            }

            //creates specific weightByUserRank instance of listSorter interface
            ListSorter weighByUserRank = new WeightByUserRank(muscle2, userWorkoutHistory);


            // calls algorithm to make workout whose exercises are chosen based on the dependency injected listSorter
            //since our sorter chooses machines based off of user rank, this algorithm instance will do the same
            Algorithm algo = new Algorithm(weighByUserRank);
            List<Object> returnMap = algo.generateWorkout(duration, muscle1, muscle2, goal, userWorkoutHistory);
            System.out.println(returnMap);
            return adapter.toJson(returnMap);
        }
        catch (InvalidInputException e){
            return e.getMessage();
        }
    }
}