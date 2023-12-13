package edu.brown.cs.student.main.server;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.*;

import edu.brown.cs.student.main.handlers.MachineHandler;
import edu.brown.cs.student.main.handlers.WorkoutHandler;
import spark.Spark;

import java.io.FileInputStream;
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
        try {
            FileInputStream serviceAccount =
                    new FileInputStream("/Users/chloenevas/Documents/CS32/term-project-jwschwar-amahns-cnevas-ibrauns/back/src/main/java/edu.brown.cs.student.main/database/ServiceAccountKey.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://brownfit-b8b8c.firebaseio.com") // Replace with your Firebase project's database URL
                    .build();

            FirebaseApp app = FirebaseApp.initializeApp(options);

            FirebaseDatabase database = FirebaseDatabase.getInstance(app);
            DatabaseReference ref = database.getReference("users");

            System.out.println("Before attaching listener"); // Add this line before attaching the listener

            // Attach a ValueEventListener to read data from the "users" node
            ref.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    System.out.println("Listener onDataChange"); // Add this line to check if the listener is triggered

                    if (dataSnapshot.exists()) {
                        for (DataSnapshot userSnapshot : dataSnapshot.getChildren()) {
                            // Assuming "users" node contains objects with properties like name, email, etc.
                            String name = userSnapshot.child("name").getValue(String.class);
                            String email = userSnapshot.child("email").getValue(String.class);

                            System.out.println("Name: " + name + ", Email: " + email);
                        }
                    } else {
                        System.out.println("No data found in the 'users' node.");
                    }
                }

                @Override
                public void onCancelled(DatabaseError databaseError) {
                    System.out.println("Listener onCancelled: " + databaseError.getMessage());
                }
            });

        } catch (IOException e) {
            System.out.println("hey");
            e.printStackTrace();
        }

        new Server();
        System.out.println("Server started at http://localhost:" + port + "; exiting main...");

    }
}