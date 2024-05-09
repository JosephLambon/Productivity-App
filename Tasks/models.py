from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    def natural_key(self):
        return (self.username)
class Task(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_tasks")
    task = models.CharField(max_length=255, null=False, blank=False)
    completed = models.BooleanField(default=False)
    target_date = models.DateField(null=True, blank=True)
    target_time = models.TimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, editable=False, null=False, blank=False)

    def __str__(self):
        return self.task
    

# Define a 'Calendar Event'
class CalendarEvent(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_calendar_event")
    date = models.DateField(null=False, blank=False)
    title = models.CharField(max_length=255, null=False, blank=False)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, editable=False, null=False, blank=False)

# Define a 'Day'.
# Must contain a list of Calendar Events, initially empty.
class Day(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_day")
    date = models.DateField(null=False, blank=False)
    events = models.ManyToManyField(CalendarEvent, related_name="Day_of_Event")

