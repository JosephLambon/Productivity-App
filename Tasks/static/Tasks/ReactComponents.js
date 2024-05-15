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
        // Define dates to be displayable and pass the logic below, even if no target date
        const now = new Date();
        const now_formatted = now.toLocaleDateString('en-UK', { day: '2-digit', month: 'short' });
        let targetDate = null;
        let td_formatted = null;
        if (props.target_date != null) {
            targetDate = new Date(props.target_date);
            td_formatted = targetDate.toLocaleDateString('en-UK', { day: '2-digit', month: 'short' });
        }
        // Create components to update whether or not a task is 'completed'
        const [completed, setCompleted] = React.useState(props.completed);
        // 'hidden' variable to detect hovering and render accordingly
        const [hidden, setHidden] = React.useState(true)
        const staticUrl = document.getElementById('app').dataset.staticUrl;
        const audio = new Audio(staticUrl);

        const csrfToken = "{{ csrf_token }}";

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

        const handleEdit = () => {
            let django_url = `/edit-task/${props.id}`;
            fetch(django_url)
                .then(response => {
                    // Handle the response here, for example:
                    if (response.ok) {
                        // If the response is OK, you might redirect or update the UI
                        window.location.href = django_url;
                    } else {
                        // Handle errors here
                    }
                })
                .catch(error => {
                    // Handle fetch errors here
                });
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
                                        <button title="Edit" onClick={handleEdit} class="delete-btn" id={`edit-btn_${props.id}`}>
                                            &#128395;
                                        </button>
                                    )}
                                </div>

                                <div class="col-2 col-md-2 target-time-container">
                                    {hidden ? (
                                        <div class="due">{props.target_time}</div>
                                    ) : (
                                        <button title="Delete" onClick={handleDelete} class="delete-btn" id={`delete-btn_${props.id}`}>
                                            &#128465;
                                        </button>    
                                           
                                    )}                                   
                                </div>
                        </label>
                        
                    </div>      
            </div>  
        );  
    };

    const Day = ({dayEvents}) => {
        console.log(dayEvents);
        const time_array = [];
        const hrs = ["12 AM", "6 AM", "12 PM", "6 PM"];
        for (let i=0; i < 24; i++) {
            for (let j=0; j < 4; j++) {
                time_array.push(`${i}:${j === 0 ? `00` : 15*j}`);
            }
        }
        
        return (
            <div class="row">
                <div class="col-4">
                <div id="list-example" class="list-group">
                    <a class="list-group-item list-group-item-action" href={`#list-item-1`}>12am</a>
                    <a class="list-group-item list-group-item-action" href={`#list-item-24`}>6am</a>
                    <a class="list-group-item list-group-item-action" href={`#list-item-48`}>12pm</a>
                    <a class="list-group-item list-group-item-action" href={`#list-item-72`}>6pm</a>
                </div>
                </div>
                <div class="col-8">
                <div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-smooth-scroll="true" class="scrollspy-example" tabindex="0">
                {time_array.map((time, index) => (
                        <div class="daySegment" key={index} id={`hr_${time.split(':')[0]}-min_${time.split(':')[1]}`}>
                            {time.split(':')[1] === '00' ? (
                            <h5 class='top-border time' id={`list-item-${index + 1}`} autoFocus={index === 23}>{time}</h5>
                            ) : (
                            <h5 class='other-top-border time'id={`list-item-${index + 1}`}></h5>
                            )}
                            <p></p>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        )
    }

    const Week = ({ dates, events, ids }) =>{
        
        const handleDayClick = (date, dayID) => {
            let django_url = `/day-view/${dayID}`;
            fetch(django_url)
                .then(response => {
                    // Handle the response here, for example:
                    if (response.ok) {
                        // If the response is OK, you might redirect or update the UI
                        window.location.href = django_url;
                    } else {
                        // Handle errors here
                    }
                })
                .catch(error => {
                    // Handle fetch errors here
                });
            }

        return (
            <div class="row">
                {dates.map((date, index) => (
                        <div key={index} className={"col p-3 border position-relative" + (date.toDateString() === new Date().toDateString() ? " today mont-bold" : "")}
                        onClick={() => handleDayClick(date, ids[index])}>
                            {date.toLocaleDateString("en-US", { day: "numeric" })} {/* Display day of the week and date */}
                        <br/>
                        {events[index] && events[index].length > 0 && ( // Check if events exist and its length is greater than 0
                        <span className="event-counter mont-bold">
                            {events[index].length}
                        </span>
                    )}
                    
                        </div>
                
                    ))}
            </div>
        )
    };

    // Define 'Month' as 6 weeks.
    const Month = ({ monthDates }) => {
        const datesOnly = monthDates.map(item => new Date(item.date));
        const eventsOnly = monthDates.map(item => item.events);
        const dayIdOnly = monthDates.map(item => item.id);
        
        console.log(dayIdOnly[20]);

        const weeks = [];

        // Define the 6 seperate weeks
        for (let i = 0; i < 6; i++) {
            const startIdx = i * 7;
            const endIdx = startIdx + 7;
            weeks.push(<Week key={i} dates={datesOnly.slice(startIdx, endIdx)} events={eventsOnly.slice(startIdx, endIdx)} ids={dayIdOnly.slice(startIdx, endIdx)} 
            id={dayIdOnly.slice(startIdx, endIdx)} />); // Slice the 7 days for each of the six weeks.
        }

        
        // Return an array of the 6 seperate weeks.
        return (
            <div className="calendar_container">
                {weeks}
            </div>
        );
      };