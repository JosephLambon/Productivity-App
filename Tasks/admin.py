from django.contrib import admin

from .models import Task, User

class TaskAdmin(admin.ModelAdmin):
           list_display = ("id", "user", "task", "completed", 
                           "target_date", "target_time", "created")

admin.site.register(Task, TaskAdmin)