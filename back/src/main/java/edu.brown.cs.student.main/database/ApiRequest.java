package edu.brown.cs.student.main.database;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.records.Exercise;
import okio.Buffer;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

/**
 * Class connecting to the API that makes request based on muscle and goal.
 */
public class ApiRequest {

    /**
     * Calls the API with a given muscle and goal. Throws exceptions if malformed URL or IOException, which are never
     * occuring due to the simplicity of our query.
     * @param muscle - muscle to request exercises for
     * @param goal - goal to request exercises for
     * @return - returns a list of valid exercises with the given muscle and goal
     * @throws MalformedURLException - Explained above.
     * @throws IOException - Explained above.
     */
    public List<Exercise> makeExerciseAPIRequest(String muscle, String goal) throws MalformedURLException, IOException {
        // converts muscle query from front end to correct query for API
        String apimuscle = switch (muscle) {
          case "quads" -> "quadriceps";
          case "shoulders" -> "traps";
          case "upper back", "delts" -> "lats";
          case "lower back" -> "lower_back";
          case "N/A", "full body" -> "";
          default -> muscle;
        };
      URL url = new URL("https://api.api-ninjas.com/v1/exercises?muscle=" + apimuscle);
        HttpURLConnection clientConnection = connect(url); // connect to api
        Moshi moshi = new Moshi.Builder().build();
        Type type = Types.newParameterizedType(List.class, Exercise.class);

        JsonAdapter<List<Exercise>> adapter =
                moshi.adapter(type); // creates moshi object that will read json
        List<Exercise> exerciseList = adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
        clientConnection.disconnect();
        return exerciseList;
    }

    /**
     * A private helper method that checks to ensure a successful connection to the API,throwing an
     * error otherwise *copied from in-class exercise*
     */
    private static HttpURLConnection connect(URL requestURL) throws IOException {
        URLConnection urlConnection = requestURL.openConnection();
        if (!(urlConnection instanceof HttpURLConnection))
            throw new MalformedURLException("unexpected: result of connection wasn't HTTP");
        HttpURLConnection clientConnection = (HttpURLConnection) urlConnection; // have to typecast
        clientConnection.setRequestProperty("x-api-key", "c2K9n0+14CqW9p7YPuKYVw==VQz1iCoWijaglwns");
        clientConnection.connect();
        if (clientConnection.getResponseCode() != 200)
            throw new MalformedURLException(
                    "unexpected: API connection not success status " + clientConnection.getResponseMessage());
        return clientConnection;
    }

}
