// For inputted 'minutes' of 'hh:mm', find the nearest 15min marker
function find_nearestMinutes(minute) {
    const quarters = [0,15,30,45,60];
    // Find absolute differences between 'quarters' values and the minute
    const calc = quarters.map(n => Math.abs(n - minute));
    const minDistance = Math.min(...calc); // '...' spread syntax passes the array of numbers as seperate numbers
    const closestIndex = calc.indexOf(minDistance);
    let closest_min = quarters[closestIndex];
    closest_min = String(closest_min);
    
    // Return the 'minute' string
    return closest_min;
}
// For given 'hh:mm' with inputs only having 15 minute intervals
// Return appropriate timeblock
function visual_TimeFinder(hour, nearest_found_mins) {
    const nearest_fifteen = nearest_found_mins;
    let starting_minute = '';
    let starting_hour = hour;
    
    if (nearest_fifteen == 60) {
        starting_hour = hour + 1;
        starting_minute = '00';
    } else if (nearest_fifteen == 0) {
        starting_hour = hour;
        starting_minute = "00";
    } else {
        starting_hour = hour;
        starting_minute = String(nearest_fifteen);
    }

    const visualStartTime = String(starting_hour) + ":" + starting_minute;
    
    return visualStartTime;
}

// For an inputted event, return appropriate start and end points
// for the event visual on day view / scheduler.
function get_VisualPoints(event) {
    // Get start time
    let start_time = event.start_time;
    let st_minute = start_time.split(':')[1];
    st_minute = Number(st_minute);
    let st_hour = start_time.split(':')[0];
    st_hour = Number(st_hour);
    const nearest_st_min = find_nearestMinutes(st_minute);
    // Find nearest 15 min block to start time
    // So can start visual event here.
    // (dayViewContainer rendered in 15 min blocks)
    const visualStartTime = visual_TimeFinder(st_hour, nearest_st_min);
    // Get end time
    let end_time = event.end_time;
    let et_minute = end_time.split(':')[1];
    et_minute = Number(et_minute);
    let et_hour = end_time.split(':')[0];
    et_hour = Number(et_hour);
    const nearest_et_min = find_nearestMinutes(et_minute);
    // Find nearest 15 min block to start time
    // So can start visual event here.
    // (dayViewContainer rendered in 15 min blocks)
    const visualEndTime = visual_TimeFinder(et_hour, nearest_et_min);
    return [visualStartTime, visualEndTime];
}

// Render events to the dayViewContainer
function renderEvents(dayData) {
    const events = dayData.events;

    for (const event of events) {
        let visualStartTime = get_VisualPoints(event)[0];
        let visualEndTime = get_VisualPoints(event)[1];
        console.log("Event: ", event);
        console.log("Start: ", visualStartTime);
        console.log("End: ", visualEndTime);

         // Find the divs corresponding to the start and end times
        const startDiv = document.getElementById(`hr_${visualStartTime.split(":")[0]}-min_${visualStartTime.split(":")[1]}`);
        const endDiv = document.getElementById(`hr_${visualEndTime.split(":")[0]}-min_${visualEndTime.split(":")[1]}`);
        
        // Iterate over the divs between start and end times
        let currentDiv = startDiv.nextElementSibling;
        // Add title to top of event (First one after start time)
        currentDiv.innerHTML = `<p class="event-title mont-bold">${event.title}</p>`;
        while (currentDiv !== endDiv) {
            // Update inner HTML and adjust CSS styling
            currentDiv.classList.add('calendar-event');
            currentDiv.classList.add('event-side-border');
            currentDiv = currentDiv.nextElementSibling;
        }
        startDiv.classList.add('calendar-event');
        startDiv.classList.add('event-side-border');
        startDiv.classList.add('event-top-border');
        endDiv.classList.add('calendar-event');
        endDiv.classList.add('event-side-border');
        endDiv.classList.add('event-bottom-border');

    }


}

function autofillEndTime() {
    document.addEventListener('DOMContentLoaded', function() {
        const startTimeField = document.getElementById('startTime');
        const endTimeField = document.getElementById('endTime');

        startTimeField.addEventListener('change', function() {
            // Get the selected start time value
            const startTimeValue = startTimeField.value;

            // Parse the start time to get hours and minutes
            const [hours, minutes] = startTimeValue.split(':').map(Number);

            // Calculate end time as 1 hour after start time
            const endTimeHours = hours + 1;
            const endTimeMinutes = minutes;

            // Format end time as HH:MM string
            const endTimeValue = `${endTimeHours.toString().padStart(2, '0')}:${endTimeMinutes.toString().padStart(2, '0')}`;

            // Set the value of the end time field
            endTimeField.value = endTimeValue;
            endTimeField.innerText = endTimeValue;
        });
    });
}