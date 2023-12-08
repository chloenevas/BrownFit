package edu.brown.cs.testing;

import edu.brown.cs.student.main.algorithm.ShortAlgo;
import edu.brown.cs.student.main.database.MockAccount;
import edu.brown.cs.student.main.records.Machine;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class dailyWorkoutUnitTesting {

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

        ShortAlgo salgo = new ShortAlgo();
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

        ShortAlgo salgo = new ShortAlgo();
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

        ShortAlgo salgo = new ShortAlgo();
        List<Object> returnMap = salgo.generateWorkout("30-60 minutes", "shoulders", "biceps", "strength", mAcc1);
        System.out.println(returnMap);

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
