package edu.brown.cs.student.main.handlers;

import spark.Request;
import spark.Response;
import spark.Route;

public class View implements Route {

  @Override
  public Object handle(Request request, Response response) {
    return "lets gooooo";
  }
}


