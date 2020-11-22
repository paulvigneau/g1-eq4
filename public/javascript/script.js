function showPopup(id = null) {
    const wrapper = document.querySelector('.pop-up-wrapper');
    const popup = document.querySelector(id ? id : '.pop-up');
    wrapper.style.display = 'block';
    popup.style.display = 'block';
}

function closePopup() {
    const wrapper = document.querySelector('.pop-up-wrapper');
    const popups = document.querySelectorAll('.pop-up');
    wrapper.style.display = 'none';
    popups.forEach(p => p.style.display = 'none');
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showDropdown() {
    document.getElementById('myDropdown').classList.toggle('show');
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
