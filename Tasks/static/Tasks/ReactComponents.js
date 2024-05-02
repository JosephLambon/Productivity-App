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
        let targetDate = null;
        let td_formatted = null;
        if (props.target_date != null) {
            targetDate = new Date(props.target_date);
            td_formatted = targetDate.toLocaleDateString('en-UK', { day: '2-digit', month: 'short' });
        }
        const [completed, setCompleted] = React.useState(props.completed);
        const [hidden, setHidden] = React.useState(true)
        const staticUrl = document.getElementById('app').dataset.staticUrl;
        const audio = new Audio(staticUrl);

        // Define refs for each button
        const delBtnRef = React.useRef(null);
        const editBtnRef = React.useRef(null);

        const handleEdit = () => {
            // Edit logic
            console.log('Edit button clicked.')  
        };

        const handleDelete = () => {
            // Delete logic
            const item = document.getElementById('taskContainer_' + props.id);

            // Ask for confirmation before deleting task.
            const confirmed = confirm("Are you sure you want to delete this task?");

            if (!confirmed) {
                return; // If user cancels, exit the function
                }

            fetch('/delete-task/',  {
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
            
            item.remove();
        };

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
                        setHidden(true);
                    } else {
                        // Handle error.
                        console.error('Error completing this task:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
                audio.play();
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
                    setHidden(false);
                } else {
                    // Handle error.
                    console.error('Error completing this task:', data.error);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
            audio.play();
        }

        const handleClick = () => {
            if (completed) {
                Uncomplete();
            } else {
                Complete();
            }
        }



        return (
            <div class="row" style={{paddingLeft: '20px', paddingRight: '20px'}} id={`taskContainer_${props.id}`}
            onMouseEnter={() => setHidden(false)} onMouseLeave={() => setHidden(true)}>
                        <div class="form-check">
                            {completed ? (
                            <input class="form-check-input" type="checkbox" value="" data-task-id={props.id} 
                            checked={completed} onClick={handleClick} key={props.id} />
                            ) : (
                            <input class="form-check-input" type="checkbox" value="" data-task-id={props.id} 
                            checked={completed} onClick={handleClick} key={props.id} />
                            )}
                            
                            <label class="form-check-label d-flex justify-content-between" for="flexCheckDefault">
                                <div class="col-6 col-md-6">{props.task}</div>
                    

                                <div class="col-2 col-md-2 target-date-container">
                                    {hidden ? (
                                        props.target_date != null ? (
                                            targetDate > now ? (
                                                <div class="due">{td_formatted}</div>
                                            ) : td_formatted == now_formatted ? (
                                                <div class="due" style={{ color: 'blue' }}>Today</div>
                                            ) : (
                                                <div class="danger due">{td_formatted}</div>
                                            )
                                        ) : (
                                            <div></div>
                                        )
                                    ) : (
                                        <button title="Edit" ref={editBtnRef} onClick={handleEdit} class="delete-btn" id={`edit-btn_${props.id}`}>
                                            &#128395;
                                        </button>
                                    )}
                                </div>

                                <div class="col-2 col-md-2 target-time-container">
                                    {hidden ? (
                                        <div class="due">{props.target_time}</div>
                                    ) : (
                                        <button ref={delBtnRef} title="Delete" onClick={handleDelete} class="delete-btn" id={`delete-btn_${props.id}`}>
                                            &#128465;
                                        </button>    
                                           
                                    )}                                   
                                </div>
                        </label>
                        </div>
            </div>
        );  
    };