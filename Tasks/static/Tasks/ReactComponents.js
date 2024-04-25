// SOURCE - get_Cookie()
// https://docs.djangoproject.com/en/5.0/howto/csrf/

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

const Task = (props) => { 
    const now = new Date();
    const now_formatted = now.toLocaleDateString('en-UK', { day: '2-digit', month: 'short' });
    const [completed, setCompleted] = React.useState(props.completed);
    const item = document.getElementById('taskContainer_' + props.id);

    // useEffect hook to log the updated value of completed
    React.useEffect(() => {
        console.log('Toggled:', completed);
    }, [completed]);

    const toggleComplete = React.useCallback((event) => {
    // const toggleComplete = () => {
        const item = document.getElementById('taskContainer_' + props.id);
        var audio = new Audio('static/Tasks/check2.WAV');
        const newCompleted = !completed;
        console.log(item);

        setCompleted(newCompleted);

            fetch('/toggle-complete-task/',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ taskID: props.id })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network reponse was not okay.');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Update DOM, display move completed tasks appropriately
                    const completedTasksContainer = document.getElementById('completed_accordion');
                    const uncompletedTasksContainer = document.getElementById('uncompleted_tasks_container');
                    if (newCompleted) {
                        // If task is completed, move it to completed tasks container
                        audio.play();
                        completedTasksContainer.appendChild(item);
                    } else if (!newCompleted) {
                        // If task is uncompleted, move it back to uncompleted tasks container
                        uncompletedTasksContainer.appendChild(item);
                        item.children[0].children[0].checked = false;
                    }
                } else {
                    // Handle error.
                    console.error('Error completing this task:', data.error);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
        event.stopPropagation();
        }, [completed]);

    return (
        <div class="row" style={{paddingLeft: '20px', paddingRight: '20px'}} id={`taskContainer_${props.id}`}>
                      <div class="form-check">
                        {props.completed ? (
                          <input class="form-check-input" type="checkbox" value="" data-task-id={props.id} checked onClick={toggleComplete} key={props.id}/>
                        ) : (
                          <input class="form-check-input" type="checkbox" value="" data-task-id={props.id} onClick={toggleComplete} key={props.id} />
                        )}
                        
                        <label class="form-check-label d-flex justify-content-between" for="flexCheckDefault">
                            <div class="col-6 col-md-6">{props.task}</div>
                   
                       {props.target_date != null ? (
                              props.target_date > now_formatted ? (
                                  <div class="col-2 col-md-2 due">{props.target_date}</div>
                              ) : props.target_date === now_formatted ? (
                                  <div class="col-2 col-md-2 due" style={{ color: 'blue' }}>Today</div>
                              ) : (
                                  <div class="col-2 col-md-2 danger due">{props.target_date}</div>
                              )
                            ) : (
                                <div class="col-2 col-md-2"></div>
                            )}

                            {props.target_time != null ? (
                                <div class="col-2 col-md-2 due">{props.target_time}</div>
                            ) : (
                                <div class="col-2 col-md-2"></div>
                            )}
                     
                        </label>
                       
                    </div>
        </div>
    );
};