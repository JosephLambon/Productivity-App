from django import forms
from datetime import datetime



class NewTaskForm(forms.Form):
    task = forms.CharField(label="Task",max_length=255)
    target_date = forms.DateField(label='Target Completion Date',
                                  required=False,
                                  widget=forms.DateInput(attrs={'type': 'date'}),
                                  error_messages={'invalid': 'Please enter a valid date.'})
    target_time = forms.TimeField(label='Target Completion Time',
                                  required=False,
                                  widget=forms.TimeInput(attrs={'type': 'time'}),
                                  error_messages={'invalid': 'Please enter a valid time.'})
    
class NewEventForm(forms.Form):
    title = forms.CharField(label="Event", max_length=255)
    date = forms.DateField(label='Target Completion Date',
                                  required=True,
                                  widget=forms.DateInput(attrs={'type': 'date'}),
                                  error_messages={'invalid': 'Please enter a valid date.'})
    start_time = forms.TimeField(label='Target Completion Time',
                                  required=True,
                                  widget=forms.TimeInput(attrs={'type': 'time'}),
                                  error_messages={'invalid': 'Please enter a valid time.'})
    end_time = forms.TimeField(label='Target Completion Time',
                                  required=True,
                                  widget=forms.TimeInput(attrs={'type': 'time'}),
                                  error_messages={'invalid': 'Please enter a valid time.'})