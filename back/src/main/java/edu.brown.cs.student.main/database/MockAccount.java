package edu.brown.cs.student.main.database;

import edu.brown.cs.student.main.records.Machine;

import java.util.HashMap;

public record MockAccount(String username, HashMap<Machine, Integer> machineRatings) {
}
