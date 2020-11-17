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