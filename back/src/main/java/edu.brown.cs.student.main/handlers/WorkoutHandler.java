package edu.brown.cs.student.main.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.algorithm.Algorithm;
import edu.brown.cs.student.main.database.MockAccount;
import edu.brown.cs.student.main.records.Machine;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class WorkoutHandler implements Route {

    /** Handles a request to /broadband. Gets data then serializes into json that gets returned */
    @Override
    public Object handle(Request request, Response response) throws IOException {
        response.header("Access-Control-Allow-Origin", "*");
        Moshi moshi = new Moshi.Builder().build();
        Type listObject = Types.newParameterizedType(List.class, Object.class);
        JsonAdapter<List<Object>> adapter = moshi.adapter(listObject);
        try{
            String duration = request.queryParams("duration");
            String muscle1 = request.queryParams("muscle1");
            String muscle2 = request.queryParams("muscle2");
            String goal = request.queryParams("goal");
            String username = request.queryParams("username");

            if (duration == null || muscle1 == null || muscle2 == null || goal == null){
                throw new InvalidInputException("Invalid inputs. Missing duration, muscle, or goal field");
            }

            // mock account, will delete
            ArrayList<Machine> machineList = new ArrayList<>();
            Machine machine1 = new Machine("1", "png", "blah", new String[0]);
            Machine machine2 = new Machine("2", "png", "blah", new String[0]);
            Machine machine3 = new Machine("3", "png", "blah", new String[0]);
            machineList.add(machine1);
            machineList.add(machine2);
            machineList.add(machine3);
            HashMap<Machine, Integer> map1 = new HashMap<>();
            map1.put(machine1, 5);
            map1.put(machine2, 1);

            Algorithm salgo = new Algorithm();
            List<Object> returnMap = salgo.generateWorkout(duration, muscle1, muscle2, goal, new MockAccount(username, map1));
            return adapter.toJson(returnMap);
        }
        catch (InvalidInputException e){
            return e.getMessage();
        }
    }
}