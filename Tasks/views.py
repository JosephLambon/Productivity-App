from django.shortcuts import render
from .forms import NewTaskForm

def index(request):
    return render(request, "Tasks/index.html", {
        "new_task_form": NewTaskForm
    })

def load_calendar(request):
    return render(request, "Tasks/calendar.html")

# Define newTask.
# If newTask has end date, show it!
# Turn date red if overdue.
def new_task(request):
    if request.method == "POST":
        pass