# UP2154598  - A High-Intensity Interval Training Tool(HIIT) COURSEWORK

## Description
In this coursework, A HIIT App has been made. HIIT workouts are composed of multiple periods of intense work, separated by periods of lighter alternative work, or rest.

The user can decide to use the app with an account for management and long-term exercise planning. The user can also use the app without login details just simply go through anonymous mode at the bottom. 

Once the user has entered the app, the user can create their own HIIT exercise by just giving a title and a description. There is an option for the user to decide whether each exercise is to be shared for the public to see or not. 

The HIIT list will print all the activities that the user has created. The user can set the color for each activity button based on three difficulties in "Settings". Currently, there are three difficulties: Easy, Medium, and Hard. Respectively, there will be three colors: blue, green, and orange. When the user clicks on one of the activities, there will be a title and a brief description left by the user himself/herself to remind what this activity is about. 

The user can set the time based on how many hours, minutes, and seconds they want for this activity and press start to start the exercise. It can also pause or just quickly reset the timer. For the last 5 seconds, there will be a beeping sound that reminds the user the time is nearly finished. When the secondhand of the timer reaches 0 seconds, the timer will have a slightly different beeping sound and tell you the time is up in the middle of the timer. 

For the user under anonymous mode, they do not have any activities saved previously. However, fortunately for everyone, there is a default exercise where it does not have any description that tells the user what to do. The user can just use our timer for their activities. 

All activities will be saved once you click on it. It will save the user and the activity and the time when the user has clicked on it. The user can check it in the "History" on the homepage. These history records can be erased simply by just clicking on the delete button. However, this action is irreversible because the recycle bin function is currently unavailable. 

This App uses express.js and SQLite for its database. 

## How to run
Clone the repository:

1, Unzip the file.

2, Navigate to the project folder.

3, Install the npm dependencies in the terminal:
```
npm install
```
4, Start the application in the terminal:
```
npm start
```
5, Open you browser and go to:
```
http://localhost:3000
```

## Use of the AI 
Although this project was designed and written by the developer(myself), there are also uses of AI to help for the benefits of efficiency and debugging. Also in the field that the developer is not familiar with, for instance, the async functions for getting the data from the database without pending. 

In the database.mjs, getting data without pending has always concerned the development team for a while. Although a useful method has been learned, the code still looks too long which is inconvenient for future maintenance. After using the AI, a shorter and more readable method has been used to improve the readiness of the code and is quickly being used in all the scenarios where the function needs to read and obtain the data from the database. 
``` js
let passwordVariable;
let sta = getActivityNameFromId(1) ; 
sta.then(ispassword => {
        if (ispassword) {
            passwordVariable = ispassword; 
            console.log( ispassword.name ) ; 
        } else {
            console.log('no password set');
        }
    })
    .catch(error => {
        console.error('Error fetching password:', error);
    });
```

Another example of using AI to improve the working progress is to use it for the correct formatting without spending too much time using console.log() to figure out the correct output. This saves the development team(myself) what used to be taking hours just to check the correct method for the correct format and debugging.

``` js
const currentDateTime = new Date();
const year = currentDateTime.getFullYear();
const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(currentDateTime.getDate()).padStart(2, '0');
const hours = String(currentDateTime.getHours()).padStart(2, '0');
const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
```

AI has also been used in simplifying the webpage elements. One of the most complicated webpages is the hiit.html for the HIIT exercise. It has a title, a long description, a timer, and three inputs with 4 buttons. Unlike the login page which has so many templates and has been practiced many times for the development team(myself). By giving rough structures (a title, a long description, a timer, and three inputs with 4 buttons), the AI can help me label each element with a unique ID. This simplified my workflow and the time to think of ten or even twenty different ID names. Then I can start to code functions for each button and make the timer work smoothly. 


## Critical Evaluation and Implementations 
During the development process, every function has been carefully tested once in the local file to prove these functions are not wrong or to some extent that they are functional. For instance, the database.mjs file has more than 200 lines, and most of the functions have been tested with the database. By checking the databse.sqlite, it proves those functions are functional. The same process has been applied to all the HTML files the CSS files and the JS files that are attached with them. They all worked independently, and locally.

However, things never go as planned. One of the mysteries that remains is to import different functions from the database.mjs stops the entire js files from working. The importation has to be commended for the App to be run, yet without the ability to connect to the database. Due to this fact, login systems, and functions related to reading the database are all impossible. Due to the time limitation, this issue was set aside to save time for other unfinished part of this app. 




