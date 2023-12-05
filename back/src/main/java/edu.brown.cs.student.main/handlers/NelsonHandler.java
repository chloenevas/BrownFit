package edu.brown.cs.student.main.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.algorithm.ShortAlgo;
import spark.Request;
import spark.Response;
import spark.Route;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

public class NelsonHandler implements Route {

    /** Handles a request to /broadband. Gets data then serializes into json that gets returned */
    @Override
    public Object handle(Request request, Response response) {

        String duration = request.queryParams("duration");
        String primary = request.queryParams("primary");
        String secondary = request.queryParams("secondary");
        String goal = request.queryParams("goal");

        Moshi moshi = new Moshi.Builder().build();
        Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
        JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObject);

        try{

        return adapter.toJson(new ShortAlgo(duration, primary, secondary, goal).getWorkout());

    }

        catch (Exception e) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("type", "error");
            errorMap.put("error_type", "datasource");
            errorMap.put("details", e.getMessage());
            return adapter.toJson(errorMap);
        }
    }

}