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
        URL url = new URL("https://api.api-ninjas.com/v1/exercises?muscle=" + muscle);
        HttpURLConnection clientConnection = connect(url); // connect to api
        Moshi moshi = new Moshi.Builder().build();
        Type type = Types.newParameterizedType(List.class, Exercise.class);

        JsonAdapter<List<Exercise>> adapter =
                moshi.adapter(type); // creates moshi object that will read json
        List<Exercise> exerciseList = adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
        System.out.println(exerciseList.get(0).name());
        clientConnection.disconnect();
        return exerciseList;
    }
    // for cardio because the database can search cardio by type
    public List<Exercise> makeExerciseAPIRequest(String goal) throws MalformedURLException, IOException {
        URL url = new URL("https://api.api-ninjas.com/v1/exercises?difficulty=beginner&type=" + goal);
        HttpURLConnection clientConnection = connect(url); // connect to api
        Moshi moshi = new Moshi.Builder().build();
        Type type = Types.newParameterizedType(List.class, Exercise.class);

        JsonAdapter<List<Exercise>> adapter =
            moshi.adapter(type); // creates moshi object that will read json
        List<Exercise> exerciseList = adapter.fromJson(new Buffer().readFrom(clientConnection.getInputStream()));
        System.out.println(exerciseList.get(0).instructions());
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
