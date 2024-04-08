function toggleActive() {
    const nav_item = document.getElementById(this.id);
    // Toggle active class for clicked item
    nav_item.classList.add('active');
    console.log(nav_item.classList);

    // Toggle active class for all other nav items
    const all_nav_items = document.querySelectorAll('.nav-link');
    all_nav_items.forEach(item => {
        if (item !== nav_item) {
            item.classList.remove('active');
        }
    });
}

var nav_item_tasks = document.getElementById('nav_tasks');
var nav_item_calendar = document.getElementById('nav_calendar');

nav_item_tasks.addEventListener('click', toggleActive);
nav_item_calendar.addEventListener('click', toggleActive);