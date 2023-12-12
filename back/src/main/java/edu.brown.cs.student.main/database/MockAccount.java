package edu.brown.cs.student.main.database;

import edu.brown.cs.student.main.records.Machine;

import java.util.HashMap;
/**
 * Mock of an account used before fire base was connected to the backend. Used for implementation and testing.
 * @param username - account username
 * @param machineRatings - map of exercise ratings for a user
 */
public record MockAccount(String username, HashMap<Machine, Integer> machineRatings) {
}
