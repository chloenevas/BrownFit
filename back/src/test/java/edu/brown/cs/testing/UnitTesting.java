package edu.brown.cs.testing;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.algorithm.Algorithm;
import edu.brown.cs.student.main.algorithm.ListSorter;
import edu.brown.cs.student.main.algorithm.WeightByUserRank;
import edu.brown.cs.student.main.database.ApiRequest;
import edu.brown.cs.student.main.database.NelsonMachineDatabase;
import edu.brown.cs.student.main.records.Machine;

import java.lang.reflect.Type;
import java.util.*;

import org.junit.Before;
import org.junit.Test;
import org.testng.Assert;

import java.io.IOException;

public class UnitTesting {
private List<String> duration;
private List<String> muscles;
private List<String> goals;

    @Before
    public void setUp(){
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
        Machine machine1 = new Machine("Ab Crunch", "png", "blah", new String[0]);
        Machine machine2 = new Machine("Back Row", "png", "blah", new String[0]);
        Machine machine3 = new Machine("3", "png", "blah", new String[0]);
        machineList.add(machine1);
        machineList.add(machine2);
        machineList.add(machine3);


        //creates specific instance of listSorter interface
        String history = "Ab Crunch/5;Back Row/1";
        ListSorter weighByUserRank = new WeightByUserRank("", history);
        List<Machine> returnList = weighByUserRank.getWeightedMachineList(machineList);
        Assert.assertEquals(this.getNumInstacesbyName(returnList, "Ab Crunch"), 5);
        Assert.assertEquals(this.getNumInstacesbyName(returnList, "Back Row"), 1);
        Assert.assertEquals(this.getNumInstacesbyName(returnList, "3"), 3);

    }

    @Test
    public void fuzzTestMachineSelection() throws IOException {
        ArrayList<Machine> machineList = new ArrayList<>();
        Machine machine1 = new Machine("Ab Crunch", "png", "blah", new String[0]);
        Machine machine2 = new Machine("Back Row", "png", "blah", new String[0]);
        Machine machine3 = new Machine("3", "png", "blah", new String[0]);
        machineList.add(machine1);
        machineList.add(machine2);
        machineList.add(machine3);

        String history = "Ab Crunch/5;Back Row/1";
        ListSorter weighByUserRank = new WeightByUserRank("", history);
        Algorithm salgo = new Algorithm(weighByUserRank, new NelsonMachineDatabase().getDatabase(), new ApiRequest());
        int counter1 = 0;
        int counter2 = 0;
        int counter3 = 0;
        for (int i = 0; i < 10000; i ++){
            Machine returnMachine = salgo.selectExercise(machineList);
            switch (returnMachine.getName()){
                case "Ab Crunch":
                    counter1++;
                    break;
                case "Back Row":
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
    public void testShortAlgoWorkoutGenerationReturnsBetterRankedMachinesMore() throws IOException {
        String history = "Leg Press/5;Leg Extension/1";
        ListSorter weighByUserRank = new WeightByUserRank("", history);
        Algorithm salgo = new Algorithm(weighByUserRank, new NelsonMachineDatabase().getDatabase(), new ApiRequest());
        Moshi moshi = new Moshi.Builder().build();
        Type listObject = Types.newParameterizedType(List.class, Object.class);
        JsonAdapter<List<Object>> adapter = moshi.adapter(listObject);
        int legP = 0;
        int legE = 0;
        int legC = 0;
        for (int i = 0; i < 100; i++){
            List<Object> returnMap = salgo.generateWorkout("30 minutes or less", "quads", "", "strength", history);
            if (adapter.toJson(returnMap).contains("\"Leg Press\"")){
                legP++;
            }
            else if (adapter.toJson(returnMap).contains("\"Leg Curl\"")){
                legC++;
            }
            else if (adapter.toJson(returnMap).contains("\"Leg Extension\"")){
                legE++;
            }
            Assert.assertTrue(returnMap.size() == 3);
        }
        System.out.println(legP);
        System.out.println(legE);
        System.out.println(legC);
        Assert.assertTrue(legP > legE + 20);
        Assert.assertTrue(legC > legE + 10);
        Assert.assertTrue(legP > legC + 10);

    }

    @Test
    public void randomTestGenerateWorkout() throws IOException {
        String history = "Ab Crunch/5;Back Row/1";
        ListSorter weighByUserRank = new WeightByUserRank("", history);
        Algorithm algo = new Algorithm(weighByUserRank, new NelsonMachineDatabase().getDatabase(), new ApiRequest());
        for (int i = 0; i < 100; i ++) {
            String duration = this.duration.get((int) (Math.random()*this.duration.size()));
            String muscle1 = this.muscles.get((int) (Math.random()*this.muscles.size()));
            String muscle2 = this.muscles.get((int) (Math.random()*this.muscles.size()));
            String goal = this.goals.get((int) (Math.random()*this.goals.size()));
            List<Object> testList = algo.generateWorkout(duration, muscle1, muscle2, goal, history);
            Assert.assertTrue(testList.size() == algo.getDurationMap().get(duration));
            Assert.assertTrue(this.hasNoDuplicates(testList));
        }
    }
    @Test
    public void testEdgeCases() throws IOException {
        Moshi moshi = new Moshi.Builder().build();
        Type listObject = Types.newParameterizedType(List.class, Object.class);
        JsonAdapter<List<Object>> adapter = moshi.adapter(listObject);
        ListSorter weighByUserRank = new WeightByUserRank("", "");
        Algorithm algo = new Algorithm(weighByUserRank, new NelsonMachineDatabase().getDatabase(), new ApiRequest());
        List<Object> testList = algo.generateWorkout("120 minutes or more", "hamstrings", "glutes", "strength", "");
        Assert.assertEquals(testList.size(), 9);
        Assert.assertTrue(this.hasNoDuplicates(testList));
        List<Object> testList2 = algo.generateWorkout("120 minutes or more", "calves", "calves", "strength", "");
        Assert.assertEquals(testList2.size(), 9);
        Assert.assertTrue(this.hasNoDuplicates(testList2));
        List<Object> testList3 = algo.generateWorkout("120 minutes or more", "hamstrings", "hamstrings", "strength", "");
        Assert.assertEquals(testList3.size(), 9);
        Assert.assertTrue(this.hasNoDuplicates(testList3));
        System.out.println(adapter.toJson(testList3));
        List<Object> testList4 = algo.generateWorkout("120 minutes or more", "N/A", "N/A", "strength", "");
        Assert.assertEquals(testList4.size(), 9);
        Assert.assertTrue(this.hasNoDuplicates(testList4));
    }

    private int getNumInstacesbyName(List<Machine> rl, String machine){
        int counter = 0;
        for (Machine m: rl){
            if (m.getName().equals(machine)){
                counter++;
            }
        }
        return counter;
    }

    private boolean hasNoDuplicates(List<Object> testList){
        HashSet<Object> checkForDoubles = new HashSet<>();
      for (Object o : testList) {
        if (!checkForDoubles.add(o)) {
          System.out.println(o);
        }
      }
      ;
        return checkForDoubles.size()==testList.size();
    }

}
