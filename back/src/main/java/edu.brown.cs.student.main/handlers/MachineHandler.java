package edu.brown.cs.student.main.handlers;

import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import edu.brown.cs.student.main.records.Machine;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.IOException;
/**
 *  Class used to get a machine based on a given name, used for adding exercises to user history in front end
 */
public class MachineHandler implements Route {

    /**
     * Has a single query parameter for the name and returns the machine name. Throws error if
     * parameter is missing, and handles errors briefly because only ever called from a list of machines
     * that we have set up. Returns the machine object.
     */
    @Override
    public Object handle(Request request, Response response) throws IOException {
        response.header("Access-Control-Allow-Origin", "*");
        try{
            String machineName = request.queryParams("machine");

            if (machineName == null){
                throw new InvalidInputException("Invalid inputs. Missing duration, muscle, or goal field");
            }

            Machine machine = new NelsonMachineDatabase().getDatabaseLowercase().get(machineName);
            if (machine == null){
                throw new Exception("No machine exists!");
            }

            return machine;

        }
        catch (Exception e){
            return e.getMessage();
        }
    }
}
