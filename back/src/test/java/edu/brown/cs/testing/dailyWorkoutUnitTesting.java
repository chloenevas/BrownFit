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

        ShortAlgo salgo = new ShortAlgo("", "", "", "");
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

        ShortAlgo salgo = new ShortAlgo("", "", "", "");
        List<Machine> returnList = salgo.getWeightedMachineList(machineList, "", mAcc1);
        Assert.assertEquals(this.getNumInstaces(returnList, "1"), 5);
        Assert.assertEquals(this.getNumInstaces(returnList, "2"), 1);
        Assert.assertEquals(this.getNumInstaces(returnList, "3"), 3);

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
