from django import forms
from datetime import datetime

class NewTaskForm(forms.Form):
    task = forms.CharField(label="Task",max_length=255)
    completed = forms.BooleanField(initial=False, disabled=True)
    target_date = forms.DateField(label='Target Completion Date',
                                  required=False,
                                  widget=forms.DateInput(attrs={'type': 'date'}),
                                  error_messages={'invalid': 'Please enter a valid date.'})
    target_time = forms.TimeField(label='Target Completion Time',
                                  required=False,
                                  widget=forms.TimeInput(attrs={'type': 'time'}),
                                  error_messages={'invalid': 'Please enter a valid time.'})