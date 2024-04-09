from django.shortcuts import render

def index(request):
    return render(request, "Tasks/index.html")

def load_calendar(request):
    return render(request, "Tasks/calendar.html")