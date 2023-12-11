package edu.brown.cs.testing;

import edu.brown.cs.student.main.algorithm.Algorithm;
import edu.brown.cs.student.main.database.MockAccount;
import edu.brown.cs.student.main.records.Machine;
import java.util.Collections;

import org.junit.Before;
import org.junit.Test;
import org.testng.Assert;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class dailyWorkoutUnitTesting {
private List<String> duration;
private List<String> muscles;
private List<String> goals;

    @Before
    public void setUp(){
        System.out.println("here");
        this.duration = new ArrayList<>();
        String[] dummyDur = new String[]{"30 minutes or less", "30-60 minutes", "60-90 minutes",
            "90-120 minutes", "120 minutes or more"};
        Collections.addAll(this.duration, dummyDur);
        this.muscles=new ArrayList<>();
        String[] dummyMusc = new String[]{"full body", "calves", "quads", "hamstrings",
            "triceps", "biceps", "chest", "shoulders", "upper back", "lower back",
            "delts", "glutes", "abdominals"};
        Collections.addAll(this.muscles, dummyMusc);
        this.goals=new ArrayList<>();
        String[] dummyGoals = new String[]{"strengthen muscles", "increase muscle endurance",
            "build muscles", "burn calories", "just get a good sweat in!"};
        Collections.addAll(this.goals, dummyGoals);
    }

    @Test
    public void testShortAlgoRatingUpdates() throws IOException {
        ArrayList<Machine> machineList = new ArrayList<>();
        Machine machine1 = new Machine("1", "png", "blah", new String[0]);
        Machine machine2 = new Machine("2", "png", "blah", new String[0]);
        Machine machine3 = new Machine("3", "png", "blah", new String[0]);
        machineList.add(machine1);
        machineList.add(machine2);
        machineList.add(machine3);

        HashMap<Machine, Integer> map1 = new HashMap<>();
        map1.put(machine1, 5);
        map1.put(machine2, 1);
        MockAccount mAcc1 = new MockAccount("mock", map1);

        Algorithm salgo = new Algorithm();
        List<Machine> returnList = salgo.getWeightedMachineList(machineList, "", mAcc1);
        Assert.assertEquals(this.getNumInstaces(returnList, "1"), 5);
        Assert.assertEquals(this.getNumInstaces(returnList, "2"), 1);
        Assert.assertEquals(this.getNumInstaces(returnList, "3"), 3);

    }

    @Test
    public void testShortAlgoMachineReturn() throws IOException {
        ArrayList<Machine> machineList = new ArrayList<>();
        Machine machine1 = new Machine("1", "png", "blah", new String[0]);
        Machine machine2 = new Machine("2", "png", "blah", new String[0]);
        Machine machine3 = new Machine("3", "png", "blah", new String[0]);
        machineList.add(machine1);
        machineList.add(machine2);
        machineList.add(machine3);

        HashMap<Machine, Integer> map1 = new HashMap<>();
        map1.put(machine1, 5);
        map1.put(machine2, 1);
        MockAccount mAcc1 = new MockAccount("mock", map1);

        Algorithm salgo = new Algorithm();
        int counter1 = 0;
        int counter2 = 0;
        int counter3 = 0;
        for (int i = 0; i < 10000; i ++){
            Machine returnMachine = salgo.selectExercise(machineList, "", mAcc1);
            switch (returnMachine.name()){
                case "1":
                    counter1++;
                    break;
                case "2":
                    counter2++;
                    break;
                case "3":
                    counter3++;
                    break;
            }
        }
        System.out.println(counter1);
        System.out.println(counter2);
        System.out.println(counter3);
        Assert.assertTrue((counter1 > counter3 + 1000) && (counter3 > counter2 + 1000));
    }

    @Test
    public void testShortAlgoWorkoutGeneration() throws IOException {
        ArrayList<Machine> machineList = new ArrayList<>();
        Machine machine1 = new Machine("1", "png", "blah", new String[0]);
        Machine machine2 = new Machine("2", "png", "blah", new String[0]);
        Machine machine3 = new Machine("3", "png", "blah", new String[0]);
        machineList.add(machine1);
        machineList.add(machine2);
        machineList.add(machine3);

        HashMap<Machine, Integer> map1 = new HashMap<>();
        map1.put(machine1, 5);
        map1.put(machine2, 1);
        MockAccount mAcc1 = new MockAccount("mock", map1);

        Algorithm salgo = new Algorithm();
        List<Object> returnMap = salgo.generateWorkout("120 minutes or more", "shoulders", "biceps", "strength", mAcc1);
        System.out.println(returnMap);
    }

    @Test
    public void testGenerateWorkout() throws IOException {
        ArrayList<Machine> machineList = new ArrayList<>();
        Machine machine1 = new Machine("1", "png", "blah", new String[0]);
        Machine machine2 = new Machine("2", "png", "blah", new String[0]);
        Machine machine3 = new Machine("3", "png", "blah", new String[0]);
        machineList.add(machine1);
        machineList.add(machine2);
        machineList.add(machine3);

        HashMap<Machine, Integer> map1 = new HashMap<>();
        MockAccount mAcc1 = new MockAccount("mock", map1);

        Algorithm algo = new Algorithm();
        for (int i = 0; i < 20; i ++) {
            String duration = this.duration.get((int) (Math.random()*this.duration.size()));
            String muscle1 = this.muscles.get((int) (Math.random()*this.muscles.size()));
            String muscle2 = this.muscles.get((int) (Math.random()*this.muscles.size()));
            String goal = this.goals.get((int) (Math.random()*this.goals.size()));
            System.out.println(duration +  ' ' + muscle1 + ' ' + muscle2 + ' ' +  goal);
            List<Object> testList = algo.generateWorkout(duration, muscle1, muscle2, goal, mAcc1);
            Assert.assertTrue(testList.size() == algo.getDurationMap().get(duration));
        }

        }


    @Test
    public void testEdgeCases(){

    }

    private int getNumInstaces(List<Machine> rl, String machine){
        int counter = 0;
        for (Machine m: rl){
            if (m.name().equals(machine)){
                counter++;
            }
        }
        return counter;
    }

}
