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


public class ApiRequest {

    public List<Exercise> makeExerciseAPIRequest(String muscle, String goal) throws MalformedURLException, IOException {
        String apimuscle = muscle;
        switch (muscle){
            case "quads":
                apimuscle = "quadriceps";
                break;
            case "shoulders":
                apimuscle = "traps";
                break;
            case "upper back": case "delts":
                apimuscle = "lats";
                break;
            case "lower back":
                apimuscle = "lower_back";
                break;
            case "N/A": case "full body":
                apimuscle = "";
                break;
        }
        URL url;
        if (goal.equals("cardio")){
            url = new URL("https://api.api-ninjas.com/v1/exercises?difficulty=beginner&type=cardio");
        }
        else {
            url = new URL("https://api.api-ninjas.com/v1/exercises?muscle=" + apimuscle + "&goal=strength");
        }
        return makeAPIConnection(url);
    }

    public List<Exercise> makeAPIConnection(URL url) throws IOException {
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
