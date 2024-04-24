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
    const target_date = props.target_date;
    console.log(target_date)
    };

    return (
        <div class="row" style={{paddingLeft: '20px', paddingRight: '20px'}} id={`taskContainer_${props.id}`}>
                      <div class="form-check">
                        {props.completed ? (
                          <input class="form-check-input" type="checkbox" value="" data-task-id={props.id} checked />
                        ) : (
                          <input class="form-check-input" type="checkbox" value="" data-task-id={props.id} />
                        )}
                        
                        <label class="form-check-label d-flex justify-content-between" for="flexCheckDefault">
                            <div class="col-6 col-md-6">{now_formatted}</div>
                            {props.target_date != null ? (
                                <div class="col-6 col-md-6">{props.target_date}</div>
                            ) : (
                                <div class="col-6 col-md-6"></div>
                            )}
                       
                       
                       {/* {props.target_date != None (
                              {props.target_date > now (
                                  <div class="col-2 col-md-2 due">{props.target_date}</div>
                              ) : elif props.target_date == now (
                                  <div class="col-2 col-md-2 due" style="color: blue;">Today</strong></div>
                              ) : (
                                  <div class="col-2 col-md-2 danger due">{props.target_date}</div>
                              )}
                            ) : (
                                <div class="col-2 col-md-2"></div>
                            )}

                            {props.target_time != None (
                                <div class="col-2 col-md-2 due">{props.target_time}</div>
                            ) : (
                                <div class="col-2 col-md-2"></div>
                            )}
                      */}
                        </label>
                       
                    </div>
        </div>
    );
};