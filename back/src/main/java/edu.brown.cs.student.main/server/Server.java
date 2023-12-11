package edu.brown.cs.student.main.server;


import edu.brown.cs.student.main.handlers.MachineHandler;
import edu.brown.cs.student.main.handlers.WorkoutHandler;
import spark.Spark;

import java.io.IOException;

/**
 * A class that models our server. It constructs a unique port, sets up the server's endpoints and
 * runs the server.
 */
public class Server {
    private static int port;

    /**
     * A constructor for Server
     */
    public Server() {
        this.port = 3332;
        // Set up our SparkJava server:
        Spark.port(this.port);
        // Listens and routes requests to a new Broadband object that references our global data src
        Spark.get("/generateWorkout", new WorkoutHandler());
        Spark.get("/getMachine", new MachineHandler());
        Spark.awaitInitialization();
    }

    /** Our main method that constructs and runs a new server */
    public static void main(String[] args) throws IOException {
        new Server();
        System.out.println("Server started at http://localhost:" + port + "; exiting main...");

    }
}