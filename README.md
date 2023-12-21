# term-project-jwschwar-amahns-cnevas-ibrauns

## Project Details

    Name: Term Project (BrownFit)
    Estimated time: 3 weeks
    Repo: https://github.com/cs0320-f23/term-project-jwschwar-amahns-cnevas-ibrauns

## Design Choices

    Some design choices on the backend include strategy pattern for the API and the algorithm chosen. The API strategy 
    pattern makes it very convienient for us or a future developer to connect to a different API using dependency
    injection. Simply adding another end point and depency injecting the new API, and implementing the method in the 
    new API class will allow a new database of exercises to be used. The entire algorithm class is full of design choices. 
    One would be the decision to weight exercises based on primary and secondary muscle prevelance, and also the weighting
    of exercises based on the user's rating in the database. 
    
    In the front end, something we made use of a lot were popups to display further info about topics. The design strategy
    for this was using the visibility of the popup to make it either appear or disappear upon certain actions. Another design
    choice was to set up the firebase authentication/database in index.tsx and then import that throughout to the different 
    files that needed it. This way, it was stored in one general location but could then be accessed throughout all the files.
    To work with the database and the structure of the exercise field, we created an exercise interface that had the necessary
    categories such as reps, weight, date, exercise name, image, and description. This way, when we wanted to create a new 
    exercise to add to the database, we could create it of this interface type so that everything was standardized.
 
### Class/Interface Relationships
    FRONT: 
        In the front, we have several different sections such as App, authentication, generator, home, progress, 
    index, and additional. App is responible for setting up the general components, and deals with toggling between different 
    pages. 
        home.tsx just creates a static home landing page for when the applciation first starts up. It just provides basic
    info about BrownFit and workout tips in general.
        For authentication we have the auth file as well as index. index.tsx sets up the firebase authentication and database so
    that it can be referenced from different files in the project. auth.tsx creates a login/signup/sign out button for the user and
    creates a popup when they click on it to signup/login. This connects to the firebase authentication accessed from index and 
    either logs the user in or signs them up. auth.tsx also handles sign out.
        Within our generator folder we have basicWorkoutPage.tsx and resultModal.tsx. The basic workout page sets up the dropdowns for
    the user and allows them to customize their workout. It has a button that then allows users to generate a workout. This page 
    makes the call to the backend to return the workout that was generated using the algorithm. This workout (as well as the
    user's inputs) gets passed as input props into resultModal.tsx. The result modal creates a popup once the generate workout 
    button is pressed and displays the workout result to the user. resultModal.tsx also checks to see if a user is signed in and 
    if they are, it provides them with the option to save their generated workout to their history. resultModal.tsx takes care
    of accessing the user id and their document within the database to store their new exercises in their history. 
        The progress folder contains files for the basic progress tracking page, the account info page, exercise history, and
    consistency. progressPage.tsx is just a landing page that allows users to toggle between exerciseHistory.tsx and 
    consistency.tsx. exerciseHistory.tsx contains all of the logic for displaying a user's history, allowing them to delete
    exercises, add exercises, and edit information about the exercises in their history. It uses the firebase database/auth from 
    index and accesses the current user's account to get their exercise history. From there it has different functions to perform
    all of the previously stated actions. consistency.tsx is an idea that we have if we were to develop further - coming soon! It
    would basically just allow a user to track when they worked out and store additional information in regards to that.
    accountInfo.tsx simply display's the user's account info (name & email) and allows them to edit it. 
        Another "coming soon" idea that we have is the machine page. This would display all the exercises that we have in our Nelson
    database and allow a user to scroll through and view them as well as search for specific ones. 
    
    [ANIKA EXPLANATION ABOUT ADDITIONAL]

    The backend of this project uses an algorithm to select a combination of nelson specific machines and API free weight exercises to 
    design a workout based on certain queries and possibly a user's account information. The first important feature of the backend is the 
    nelson database, which is a json file with information of every machine in the nelson fitness center. The nelson machine database 
    class parses the json and turns it into a map of machine names to machine objects, which are defined by the machine class. The basic 
    functionality of the backend is in the algorithm class, which connects to the workout handler. The handler connects to the front end, 
    which recieves a query involving a duration, two muscles, and a goal to convert into a workout. The algorithm converts these queries into 
    a workout by contacting the nelson database and also the external API in the algorithm class. If the user is signed in on the frontend, 
    the backend also recieves the user account information to process user ratings into the workout. All of these factors combine to create
    a nelson specific workout for a user who is signed in or not signed in. The server has two endpoints: one for the workout generation
    (/generateWorkout) and one for the adding of machines (/getMachine). The front end can query any machine by name and be returned the 
    full machine object to process by contacting the machine handler class. This is used when the user adds a machine to their workout history 
    by name. Our testing is explained thoroughly in the testing section. We use stategy pattern with our list sorting and API. Our list sorter
    interface can be implemented to any class, but must define the weighted machine method, which can weight machines differtly when being 
    decided for our final workout. The API interface requires the implementation of querying an API and getting a list of exercises. These
    strategy patterns are only used in 1 class each in our program, but could help a later developer seemlessly transition to their 
    adapted algorithm, or if we later wanted to create a second algorithm or API connection. 
 
### Data Structures/High Level Explanations
   
## Errors/Bugs

    There are no known errors or bugs in the program!!

## Tests
    The backend testing contains both unit testing and integration testing. The unit tests thoroughly test the algorithm. Our unit tests
    consists or random, fuzz, and mock testing. Our most complex test randomly generates a front end query and generates a workout based on 
    this query. We then repeatedly make assertions about the workout to make sure it is properly formatted and other details are correct. 
    We fuzz test this, so this run thousands of times without failure. We also check that our algorithm weighs user preferences more 
    significantly by fuzz testing three exercises with different ratings and making sure the appear in increasing rating order from least 
    to most prevelant. Our integration testing consists of mocking the API using our strategy pattern and asserting that the mocked API 
    exercise appears in the workout generated. We also assert that the workout generates with a given query. This is also tivially tested
    because our program integrates properly. 

## How to...

### Run the tests:

    In the backend, simply enter one of the testing files in the test folder and click the green play button. Note that some tests may 
    fail intentionally, so be sure to note which tests pass and fail rather than running the entire class. 
    In the frontend, RUN THE PLAYWRIGHT TESTS

### Run the program:
    To run the program, start the server from the backend using the play button from the Server file and ensure that it's running
    by viewing the localhost in the terminal. From the front, ensure that you've done npm install as well as npm install
    react-select@3.1.0 (this is repsonsible for the add exercise drop down). Then navigate to the "front" directory and enter
    npm start. From here, open the front end and you should be all set to navigate through and interact with the website!
    
