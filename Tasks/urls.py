"""
URL configuration for Tasks project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name="index"),
    path('completed_tasks/', views.list_completed, name="list_completed"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('calendar/', views.load_calendar, name="calendar"),
    path('add_task/', views.new_task, name="new_task"),
    path('complete-task/', views.complete_task, name="complete_task"),
    path('uncomplete-task/', views.uncomplete_task, name="uncomplete_task"),
    path('edit-task/<int:task_id>', views.edit_task, name="edit_task"),
    path('update-task/', views.update_task, name="update_task"),
    path('delete-task/', views.delete_task, name="delete_task"),
    path('new_event/', views.new_event, name="new_event"),
    path('day-view/<int:day_id>', views.day_view, name="day_view")
]
