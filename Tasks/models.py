from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Task(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="user_tasks")
    task = models.CharField(max_length=255, null=False, blank=False)
    completed = models.BooleanField(default=False)
    target_date = models.timestamp = models.DateTimeField()