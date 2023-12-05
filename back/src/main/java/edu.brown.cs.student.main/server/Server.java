package edu.brown.cs.student.main.server;


import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import edu.brown.cs.student.main.handlers.NelsonHandler;
import okio.Buffer;
import spark.Spark;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.*;
import java.util.List;

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
        Spark.get("/nelson", new NelsonHandler());
        Spark.awaitInitialization();
    }

    /** Our main method that constructs and runs a new server */
    public static void main(String[] args) throws IOException {
        new NelsonMachineDatabase();
        new Server();
        System.out.println("Server started at http://localhost:" + port + "; exiting main...");

    }
}