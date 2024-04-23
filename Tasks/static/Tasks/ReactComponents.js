function toggleActive(event) {
    event.preventDefault();
    const nav_item = document.getElementById(this.id);
    // Toggle active class for clicked item
    nav_item.classList.add('active');
    // Toggle active class for all other nav items
    const all_nav_items = document.querySelectorAll('.nav-link');
    all_nav_items.forEach(item => {
        if (item !== nav_item) {
            item.classList.remove('active');
        }
    });

    // Manually navigate to href URL after class toggling
    setTimeout(() => {
        window.location.href = nav_item.getAttribute('href');
    }, 100);
}

var nav_item_tasks = document.getElementById('nav_tasks');
var nav_item_calendar = document.getElementById('nav_calendar');

nav_item_tasks.addEventListener('click', toggleActive);
nav_item_calendar.addEventListener('click', toggleActive);

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.querySelectorAll('.form-check-input').forEach(function(checkbox) {
    checkbox.addEventListener('click', function() {
        var taskID = this.getAttribute('data-task-ID');

        fetch('/toggle-complete-task/',  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ taskID: taskID })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network reponse was not okay.');
            }
        return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log("Task's 'completed' status upadted successfully")
                // Update DOM, display move completed tasks appropriately
                console.log('TaskID:', taskID)

                 // Move the task to the appropriate list based on its completion status
                 const taskContainer = document.getElementById('taskContainer_' + taskID);
                 taskContainer.remove();
                 const completedTasksContainer = document.getElementById('completed_tasks_container');
                 const uncompletedTasksContainer = document.getElementById('uncompleted_tasks_container');
 
                 if (checkbox.checked) {
                     // If task is completed, move it to completed tasks container
                    //  completedTasksContainer.appendChild(taskContainer);
                    completedTasksContainer.appendChild(taskContainer);
                 } else if (!checkbox.checked) {
                     // If task is uncompleted, move it back to uncompleted tasks container
                    //  uncompletedTasksContainer.appendChild(taskContainer);
                    uncompletedTasksContainer.appendChild(taskContainer);
                 }
            } else {
                // Handle error.
                console.error('Error completing this task:', data.error);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    });
});