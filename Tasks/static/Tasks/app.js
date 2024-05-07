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