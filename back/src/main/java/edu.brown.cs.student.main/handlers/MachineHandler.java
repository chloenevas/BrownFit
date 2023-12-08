package edu.brown.cs.student.main.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.algorithm.ShortAlgo;
import edu.brown.cs.student.main.database.MockAccount;
import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import edu.brown.cs.student.main.records.Machine;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class MachineHandler implements Route {

    /** Handles a request to /broadband. Gets data then serializes into json that gets returned */
    @Override
    public Object handle(Request request, Response response) throws IOException {
        response.header("Access-Control-Allow-Origin", "*");
        try{
            String machineName = request.queryParams("machine");

            if (machineName == null){
                throw new InvalidInputException("Invalid inputs. Missing duration, muscle, or goal field");
            }


            String img = new NelsonMachineDatabase().getDatabase().get(machineName).img();
            return img;
        }
        catch (InvalidInputException e){
            return e.getMessage();
        }
    }
}
