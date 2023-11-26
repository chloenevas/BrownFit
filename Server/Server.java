package Server;


import handlers.NelsonHandler;
import spark.Spark;

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
    public static void main(String[] args) {
        // At time of creation, we decide on a specific datasource class:
        new Server();
        System.out.println("Server started at http://localhost:" + port + "; exiting main...");
    }
}