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
    var audio = new Audio('static/Tasks/check2.WAV');

    const Complete = () => {
        const item = document.getElementById('taskContainer_' + props.id);
        setCompleted(true);

            fetch('/complete-task/',  {
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
                } else {
                    // Handle error.
                    console.error('Error completing this task:', data.error);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });

            const completedTasksContainer = document.getElementById('completed_accordion');
            // If task is completed, move it to completed tasks container
            audio.play();
            completedTasksContainer.appendChild(item);
        };

    const Uncomplete = () => {
        const item = document.getElementById('taskContainer_' + props.id);
        setCompleted(false);

        fetch('/uncomplete-task/',  {
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
            } else {
                // Handle error.
                console.error('Error completing this task:', data.error);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });

        const uncompletedTasksContainer = document.getElementById('uncompleted_tasks_container');
        audio.play();
        uncompletedTasksContainer.appendChild(item);
    }

    const handleClick = () => {
        if (completed) {
            Uncomplete();
        } else {
            Complete();
        }
    }

    React.useEffect(() => {
        const item = document.getElementById(`taskContainer_${props.id}`);
        if (completed) {
            item.removeEventListener('click', Complete);
            item.addEventListener('click', Uncomplete);
        } else {
            item.removeEventListener('click', Uncomplete);
            item.addEventListener('click', Complete);
        }
        // Cleanup function to remove event listeners when component unmounts
        return () => {
            item.removeEventListener('click', Complete);
            item.removeEventListener('click', Uncomplete);
        };
    }, [completed, props.id]);
   
    return (
        <div class="row" style={{paddingLeft: '20px', paddingRight: '20px'}} id={`taskContainer_${props.id}`}>
                      <div class="form-check">
                        {completed ? (
                          <input class="form-check-input" type="checkbox" value="" data-task-id={props.id} 
                          checked={completed} key={props.id} />
                        ) : (
                          <input class="form-check-input" type="checkbox" value="" data-task-id={props.id} 
                          checked={completed} key={props.id} />
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