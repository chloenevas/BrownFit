package edu.brown.cs.student.main.handlers;

import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;

public class MachineHandler implements Route {

    /** Handles a request to /broadband. Gets data then serializes into json that gets returned */
    @Override
    public Object handle(Request request, Response response) throws IOException {
        response.header("Access-Control-Allow-Origin", "*");

            String machineName = request.queryParams("name");
        try{
            if (machineName == null){
                throw new InvalidInputException("Invalid Machine Name");
            }


            return new NelsonMachineDatabase().getDatabase().get(machineName);
        }
        catch (InvalidInputException e){
            return e.getMessage();
        }
    }
}
