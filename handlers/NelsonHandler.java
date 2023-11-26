package handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import spark.Request;
import spark.Response;
import spark.Route;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

public class NelsonHandler implements Route {

    /** Handles a request to /broadband. Gets data then serializes into json that gets returned */
    @Override
    public Object handle(Request request, Response response) {
        return "lets gooooo";
    }
}