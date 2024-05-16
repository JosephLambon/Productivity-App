# Productivity App
>### My CS50W Final Project

## Contents
1. [Project Synopsis](#project_synopsis)
2. [Project Resources](#project_resources)
3. [Distinctiveness and Complexity](#dist_and_comp)
4. [What's contained?](#contained)
5. [Setup and Usage](#setup)
6. [Video Demo](#video)


## <a id='project_synopsis'> Project Synopsis </a>
To round off the CS50W course, the aim of this final project was to design and implement a dynamic web application that differed in nature to any of the previous course's courseworks.

The only constraints were that the web app must utilise Django on the back-end, JavaScript on the front-end, and be mobile-reponsive. I chose to create a productivity app, which has a 'Tasks' page (whereby you can create a To-Do list) and a 'Calendar' page (whereby you can add events, view a month's or day's schedule).

## <a id='project_resources'> Project Resources </a>
* [Django](https://www.djangoproject.com/)
> Django is a high-level open source Python framework that makes it easier to build secure web applications.

* [React](https://react.dev/)
> React is a JavaScript framework that enables you to build slick user interfaces and build custom re-usable components.

* [Bootstrap](https://getbootstrap.com/)
> Bootstrap is a front-end library, offering pre-built components and JavaScript plug-ins.

* [Pandas](https://pandas.pydata.org/)
> Pandas is an open source data analysis and manipulation tool, built on top of Python.

* [SQLite](https://www.sqlite.org/)
> SQLite is a C-language library that implements a fast & reliable SQL database engine.

## <a id='dist_and_comp'> Distinctiveness and Complexity </a>
### Distinctiveness
Being a productivity app, the essential data being dealt with here are dates, times and titles.

Where this remains most distinct from the 'Mail', 'Auctions' and 'Social Network' projects completed prior to this, is that the experience is isolated to a single user. There is no exchange of data between users, and no social aspect.

### Complexity
The complex nature of this app lies in it having more than one essential function. The 'Tasks' and 'Calendar' portions could even be split into seperate applications. With more time, I would build these out further to have some interplay, with tasks appearing on the calendar.

The focus was on creating a more sleek and dynamic User Interface. Having implemented a much greater variety of Bootstrap components to in previous projects, I have been able to create intuitive sections for adding tasks and events. Furthermore, I decided to lean into React's potential; utilising 'useState' to render edit and delete buttons for tasks conditionally (when hovered over), removing clutter from the viewport and offering the User Experience (UX) one might expect in a modern application.

Defining four React components made customising the same front-end templates far easier. This was especially well taken advantage of for the
'Calendar' portion, defining seperate components for a 'Day', 'Week' and 'Month', each having information parsed to it.

On top of learning and implementing Bootstrap and React in greater detail, I experimented with adding audio to the application. If you run this application, you will find a sound is triggered whenever a user 'completes' a task. I believe this adds to the UX, making the completion of tasks more satisying.

A way in which I made use of JavaScript was to automatically set the 'end time' of new events to be 1 hour after any input 'start time'. This is often a sufficient amount of time for a calendar event, and potentially saves the user time hassle. Try it out by clicking 'Add' on the Calendar page.

Finally, I also made two seperate CSS files. The 'calendar.css' file targets specifically the calendar pages, de-cluttering the main 'styles.css'

## <a id='contained'> What's contained? </a>
* **calendar.html** - This HTML page renders the month view for the calendar. A small amount of JavaScript can also be found at the bottom, responsible for automatically setting the 'end-time' to 1 hour after the 'start-time' when you create an event.
* **day.html** - This HTML page renders the day view for the calendar. This utlilises the 'Day' React component I defined, calling it to be rendered. There are also four JavaScript functions defined at the bottom which render any events on top of that component.
* **edit.html** - This HTML page renders the form which allows a user to edit and update a task's title, due date or due time. 
* **index.html** - This HTML page renders the 'Tasks' page, displaying the To-Do list of the logged-in user. Contains some JS at the bottom which renders any 'Task' model components which have are completed/uncompleted, in seperate containers.
* **layout.html** - This HTML page renders the overall website template, defining the top and bottom navigation bars.
* **login.html** - The login page.
* **register.html** - The page whereby a new account can be registered.   
* **ReactComponents.js** - JavaScript file containing all of my React component definitions.
* **app.js** - JavaScript functions which improve UX in day.html and calendar.html.  
* **check2.WAV** - The audio that is played when a user completes a task.
* **calendar.css** - Styling for the calendar pages.
* **styles.css** - Styling for the remainder of the application.
* **admin.py** - Rendering data on the '/admin/' page.
* **forms.py** - Forms for adding events, and adding tasks.
* **requirements.txt** - Prerequisite packages required for application to run successfully.


## <a id='setup'> Setup and Usage </a>
#### [NOTE: Any lines of code included are intended for the command line]

### 1. Install prerequisites
a. Install [Python](https://www.python.org/) </br>
b. Install [virtualenv](https://virtualenv.pypa.io/en/latest/)
``` 
 pip install virtualenv
```
### 2. Setup virtual environment
* Create virtual environment </br>
```
# Run this line on the command line
# Replace 'env_name' with whatever your desired env's name is.

virtualenv env_name
```
* Start virtual environment
```
# This will activate your virtualenv.

source env_name/bin/activate
```
* Install required packages
```
# Running this in your command line will install all listed packages to your activated virtual environment

pip install -r requirements. txt
```
### 3. Change directory
* Change into the 'Tasks' folder.

### 4. Run development server
```
# This will host the web application locally

python manage.py runserver
```

## <a id='video'> Video Demo </a>

For this project, we were required to make a video displaying our web application's functionality. Feel free to watch this short example of the final product. There are timestamps in the bio showing each of the implemented features.

<a href= 'https://youtu.be/vhU48oo2p70'>
<img width="1494" alt="Thumbnail" 
 src="https://github.com/JosephLambon/Tasks/assets/107887718/6681ac86-9e30-4e73-820d-df09f30f0fae">
</a>