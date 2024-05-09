from django.contrib import admin

from .models import Task, CalendarEvent

class TaskAdmin(admin.ModelAdmin):
           list_display = ("id", "user", "task", "completed", 
                           "target_date", "target_time", "created")
           
class EventAdmin(admin.ModelAdmin):
           list_display = ("id", "user", "title", "date", 
                           "start_time", "end_time", "created")

admin.site.register(Task, TaskAdmin)
admin.site.register(CalendarEvent, EventAdmin)