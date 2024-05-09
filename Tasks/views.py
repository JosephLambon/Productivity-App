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

import pandas as pd
import datetime

from django.core.serializers.json import DjangoJSONEncoder
from django.core.paginator import Paginator

def serialise(tasks):
    # for task in tasks:
    #     if task.target_date != None:
    #         task.target_date = task.target_date.strftime('%d %b')
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

# TASKS

def index(request):
    if request.user.is_authenticated:
        tasks = Task.objects.filter(user=request.user).order_by('-created')
        
        p = Paginator(tasks.filter(completed=False), 10)
        page_no = request.GET.get('page')
        page_obj = p.get_page(page_no)

        serialized_tasks = serialise(page_obj.object_list)
        tasks_raw = serialise(tasks)

        return render(request, "Tasks/index.html", {
            "new_task_form": NewTaskForm,
            "tasks": serialized_tasks,
            "tasks_raw": tasks_raw,
            "now": timezone.now(),
            "page_obj": page_obj
        })
    else:
        return render(request, "Tasks/index.html", {
            "new_task_form": NewTaskForm,
            "now": timezone.now()
        })

def list_completed(request):
    if request.user.is_authenticated:
        tasks = Task.objects.filter(user=request.user).order_by('-created')
        completed_tasks = tasks.filter(completed=True)
        
        p = Paginator(completed_tasks, 30)
        page_no = request.GET.get('page')
        page_obj = p.get_page(page_no)

        serialized_tasks = serialise(page_obj.object_list)

        return render(request, "Tasks/completed.html", {
            "tasks": serialized_tasks,
            "now": timezone.now(),
            "page_obj": page_obj
        })
    else:
        return HttpResponseRedirect(reverse("index"))


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
        
        new_task = Task(user=user, task=task, completed=False,
                        target_date=target_date,
                        target_time=target_time)
        new_task.save()
        
        return HttpResponseRedirect(reverse("index"))

@login_required
def complete_task(request):
    if request.method == "POST":
        data = json.loads(request.body)
        task_id = data.get('taskID')
        
        try:
            task = Task.objects.get(id=task_id)
            task.completed = True
            task.save()
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
            task.completed = False
            task.save()
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
def edit_task(request, task_id):
    task = Task.objects.get(id=task_id)
    initial_data = {'task': task.task, 'target_date': task.target_date, 'target_time': task.target_time}
    edit_task_form = NewTaskForm(initial=initial_data)
    return render(request, "Tasks/edit.html", {
        "task": task,
        "new_task_form": edit_task_form
    })

@login_required
def update_task(request):
    user = User.objects.get(id=request.user.id)
    
    if request.method == "POST":
        form = NewTaskForm(request.POST)

        if form.is_valid():
            task_title = form.cleaned_data["task"]
            target_date = form.cleaned_data["target_date"]
            target_time = form.cleaned_data["target_time"]
        
        task = Task.objects.get(task=task_title, user=user)
        task.task = task_title
        task.target_date = target_date
        task.target_time = target_time
        task.save()
        
        return HttpResponseRedirect(reverse("index"))
    
# CALENDAR 

def get_six_weeks_around_today():
    # Get today's date
    today = datetime.date.today()

    # First day of the month subtract...
    # the number of days between 1st day of month and the start of the
    # week contianing the 1st day of the month.
    # "days=today.replace(day=1).weekday()" returns a digit 0-6
    # representing a day Monday-Sunday
    start_date = today.replace(day=1) - datetime.timedelta(days=today.replace(day=1).weekday())

    # Calculate the end date (Sunday) of the week containing the last day of the month
    next_month = today.replace(day=28) + datetime.timedelta(days=4) # Holds a day into the next month.
    # next_month.day represents the day of next month that 'next_month' is in.
    end_date = next_month - datetime.timedelta(days=next_month.day)

    # Adjust start date to the beginning of the week
    start_date -= datetime.timedelta(days=start_date.weekday())

    # Adjust end date to the end of the week
    end_date += datetime.timedelta(days=6 - end_date.weekday())

    return start_date, end_date

# Define a new view, to find today's date,
# then find on which day the 1st and last day of that month falls
# Then, get the 42 days between the Monday of the
# Week containing the 1st, and the Sunday of the week
# containing the 28th-31st of that month.
def load_calendar(request):
    start_date, end_date = get_six_weeks_around_today()
    month_view_dates = pd.date_range(start_date, periods=42)
    print(month_view_dates)

    return render(request, "Tasks/calendar.html", {
        "start_date": start_date,
        "end_date": end_date
    })

    


