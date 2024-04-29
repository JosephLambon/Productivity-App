from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from .models import User, Task
from .forms import NewTaskForm
import json

from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder

def serialise(tasks):
    for task in tasks:
        if task.target_date != None:
            task.target_date = task.target_date.strftime('%d %b')
    # Serialisation allows us to transfer and store the
    # posts data in a way that remains accessible in JSX
    # AKA translates our Django 'Post' model data.
    # See defined natural key in models.py . By default, returns User ID, which is unhelpful.
    s_tasks = [
        {
            'user': task.user.natural_key(),
            'task': task.task,
            'completed': task.completed, # Using natural key to retrieve username
            'target_date': task.target_date,
            'target_time': task.target_time,
            'id': task.id,
            'created': task.created
        }
        for task in tasks
    ]
    # Sort the tasks by date created
    sorted_tasks = sorted(s_tasks, key=lambda x: x['created'], reverse=True)  

    # Serialize list of dictionary's defined above for each post into JSON string.
    # DjangoJSONEncoder allows serialisation of datetime objects.
    serialized_tasks = json.dumps(sorted_tasks, cls=DjangoJSONEncoder)
    return serialized_tasks

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "Tasks/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "Tasks/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "Tasks/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "Tasks/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "Tasks/register.html")

def index(request):
    if request.user.is_authenticated:
        tasks = Task.objects.filter(user=request.user).order_by('-created')
        serialized_tasks = serialise(tasks)

        return render(request, "Tasks/index.html", {
            "new_task_form": NewTaskForm,
            "tasks": serialized_tasks,
            "now": timezone.now()
        })
    else:
        return render(request, "Tasks/index.html", {
            "new_task_form": NewTaskForm,
            "now": timezone.now()
        })

def load_calendar(request):
    return render(request, "Tasks/calendar.html")

# Define newTask.
# If newTask has end date, show it!
# Turn date red if overdue.
@login_required
def new_task(request):    
    user = User.objects.get(id=request.user.id)
    if request.method == "POST":
        form = NewTaskForm(request.POST)

        if form.is_valid():
            task = form.cleaned_data["task"]
            target_date = form.cleaned_data["target_date"]
            target_time = form.cleaned_data["target_time"]
        
        print("target date: ",target_date)
        print("target time: ",target_time)
        new_task = Task(user=user, task=task, completed=False,
                        target_date=target_date,
                        target_time=target_time)
        new_task.save()
        
        return HttpResponseRedirect(reverse("index"))

    # Might need to event.preventDefault to stop page reloading...

    # Add task to database, render new task to DOM!

@login_required
def complete_task(request):
    if request.method == "POST":
        data = json.loads(request.body)
        task_id = data.get('taskID')
        
        try:
            task = Task.objects.get(id=task_id)
            print('Initial: ', task.completed)
            task.completed = True
            task.save()
            print('After toggle: ', task.completed)
            return JsonResponse({'success': True, 'message': "Task 'completed' successfully"}, status=200)
        except Task.DoesNotExist: 
            return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@login_required
def uncomplete_task(request):
    if request.method == "POST":
        data = json.loads(request.body)
        task_id = data.get('taskID')
        
        try:
            task = Task.objects.get(id=task_id)
            print('Initial: ', task.completed)
            task.completed = False
            task.save()
            print('After toggle: ', task.completed)
            return JsonResponse({'success': True, 'message': "Task 'uncompleted' successfully"}, status=200)
        except Task.DoesNotExist: 
            return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@login_required
def delete_task(request):
    if request.method == "POST":
        data = json.loads(request.body)
        task_id = data.get('taskID')
        try:
            task = Task.objects.get(id=task_id)
            task.delete()
            return JsonResponse({'success': True, 'message': "Task's deleted successfully"}, status=200)
        except Task.DoesNotExist: 
            return JsonResponse({'success': False, 'error': 'Task not found'}, status=404)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=400)

@login_required
def edit_task(request):
    pass