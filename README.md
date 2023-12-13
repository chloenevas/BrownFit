# term-project-jwschwar-amahns-cnevas-ibrauns

## Project Details

    Name: Term Project (BrownFit)
    Estimated time: 3 weeks
    Repo: https://github.com/cs0320-f23/term-project-jwschwar-amahns-cnevas-ibrauns

## Design Choices

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
    
    [INSERT ANIKA EXPLANATION ABOUT ADDITIONAL]

    BACK:


### Data Structures/High Level Explanations
   
## Errors/Bugs

## Tests
    

## How to...

### Run the tests:
    

### Run the program:
To run the program, start the server from the backend using the play button from the Server file and ensure that it's running
by viewing the localhost in the terminal. From the front, ensure that you've done npm install as well as npm install
react-select@3.1.0 (this is repsonsible for the add exercise drop down). Then navigate to the "front" directory and enter
npm start. From here, open the front end and you should be all set to navigate through and interact with the website!

   