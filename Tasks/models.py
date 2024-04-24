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
