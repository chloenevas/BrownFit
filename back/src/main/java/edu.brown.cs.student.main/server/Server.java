package edu.brown.cs.student.main.server;


import edu.brown.cs.student.main.database.ApiRequest;
import edu.brown.cs.student.main.database.ExerciseAPI;
import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import edu.brown.cs.student.main.handlers.MachineHandler;
import edu.brown.cs.student.main.handlers.WorkoutHandler;
import edu.brown.cs.student.main.records.Exercise;
import edu.brown.cs.student.main.records.Machine;
import java.util.HashMap;
import java.util.List;
import spark.Spark;

import java.io.IOException;

/**
 * A class that models our server. It constructs a unique port, sets up the server's endpoints and
 * runs the server.
 */
public class Server {
    private static int port;

    private ExerciseAPI API;
    private HashMap<String, Machine> database;

    /**
     * A constructor for Server
     */
    public Server(HashMap<String, Machine> database, ExerciseAPI API) {
        this.API = API;
        this.database = database;
        this.port = 3332;
        // Set up our SparkJava server:
        Spark.port(this.port);
        // Listens and routes requests to a new Broadband object that references our global data src
        Spark.get("/generateWorkout", new WorkoutHandler(this.database, this.API));
        Spark.get("/getMachine", new MachineHandler());
        Spark.awaitInitialization();
    }

    /** Our main method that constructs and runs a new server */
    public static void main(String[] args) throws IOException {
        new Server(new NelsonMachineDatabase().getDatabase(), new ApiRequest());
        System.out.println("Server started at http://localhost:" + port + "; exiting main...");

    }
}