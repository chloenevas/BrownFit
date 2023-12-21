package edu.brown.cs.testing;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import edu.brown.cs.student.main.handlers.WorkoutHandler;
import edu.brown.cs.student.main.records.Exercise;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import okio.Buffer;
import org.junit.Assert;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

public class IntegrationTesting {


  @BeforeAll
  public static void setupOnce() {
    // Pick an arbitrary free port
    Spark.port(0);
    // Eliminate logger spam in console for test suite
    Logger.getLogger("").setLevel(Level.WARNING); // empty name = root
  }

  // Helping Moshi serialize Json responses; see the gearup for more info.
  private final Type mapStringObject = Types.newParameterizedType(List.class, Object.class);
  private JsonAdapter<List<Object>> adapter;
  //private JsonAdapter<CensusData> censusDataAdapter;

  @BeforeEach
  public void setup() throws IOException {
    // Re-initialize parser, state, etc. for every test method

    // Use *MOCKED* data when in this test environment.
    // Notice that the WeatherHandler code doesn't need to care whether it has
    // "real" data or "fake" data. Good separation of concerns enables better testing.
    Spark.get("/generateWorkout",
        new WorkoutHandler(new NelsonMachineDatabase().getDatabase(), new MockAPI()));
    Spark.awaitInitialization(); // don't continue until the server is listening

    // New Moshi adapter for responses (and requests, too; see a few lines below)
    //   For more on this, see the Server gearup.
    Moshi moshi = new Moshi.Builder().build();
    adapter = moshi.adapter(mapStringObject);
    //censusDataAdapter = moshi.adapter(CensusData.class);
  }

  @AfterEach
  public void tearDown() {
    // Gracefully stop Spark listening on both endpoints
    Spark.unmap("/generateWorkout");
    Spark.awaitStop(); // don't proceed until the server is stopped
  }

    /*
    Recall that the "throws" clause doesn't matter -- JUnit will fail if an
    exception is thrown that hasn't been declared as a parameter to @Test.
     */

  /**
   * Helper to start a connection to a specific API endpoint/params
   *
   * @param apiCall the call string, including endpoint (Note: this would be better if it had more
   *                structure!)
   * @return the connection for the given URL, just after connecting
   * @throws IOException if the connection fails for some reason
   */
  private HttpURLConnection tryRequest(String apiCall) throws IOException {
    // Configure the connection (but don't actually send a request yet)
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    // The request body contains a Json object
    clientConnection.setRequestProperty("Content-Type", "application/json");
    // We're expecting a Json object in the response body
    clientConnection.setRequestProperty("Accept", "application/json");

    clientConnection.connect();
    return clientConnection;
  }

  @Test
  public void testGenerateSuccess() throws IOException {
    /////////// LOAD DATASOURCE ///////////
    // Set up the request, make the request
    HttpURLConnection loadConnection = tryRequest(
        "generateWorkout?duration=30%20minutes%20or%20less&"
            + "&muscle1=biceps&muscle2=N/A&goal=strengthen%20muscles&history=");
    // Get an OK response (the *connection* worked, the *API* provides an error response)
    assertEquals(200, loadConnection.getResponseCode());
    // Get the expected response: a success
    List<Object> body = adapter.fromJson(new Buffer().readFrom(loadConnection.getInputStream()));
    System.out.println(body.get(2));
    String name = "Incline Hammer Curls";
    String type = "strength";
    String muscle = "biceps";
    String equipment = "dumbbell";
    String difficulty = "beginner";
    String instructions = "Seat yourself on an incline bench with a dumbbell in each hand. "
        + "You should pressed firmly against he back with your feet together. "
        + "Allow the dumbbells to hang straight down at your side, holding them with a neutral grip. "
        + "This will be your starting position. Initiate the movement by flexing at the elbow, "
        + "attempting to keep the upper arm stationary. Continue to the top of the movement and pause, "
        + "then slowly return to the start position.";
    Exercise exercise = new Exercise(name, type, muscle, equipment, difficulty, instructions);
    // asserts that the workout contains the mock workout from the mock API, fails due to formatting only
    assertEquals(body.get(2), exercise);
  }
}