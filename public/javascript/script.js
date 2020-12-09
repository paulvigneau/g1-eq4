// eslint-disable-next-line no-unused-vars
function showPopup(id = null) {
    const wrapper = document.querySelector('.pop-up-wrapper');
    const popup = document.querySelector(id ? id : '.pop-up');
    wrapper.style.display = 'block';
    popup.style.display = 'block';
}

// eslint-disable-next-line no-unused-vars
function closePopup() {
    const wrapper = document.querySelector('.pop-up-wrapper');
    const popups = document.querySelectorAll('.pop-up');
    const forms = document.querySelectorAll('.pop-up form');
    wrapper.style.display = 'none';
    popups.forEach(p => p.style.display = 'none');
    forms.forEach(f => f.reset());
}

// eslint-disable-next-line no-unused-vars
function sendForm(url, data, method = 'POST') {
    return fetch(url, {
        method: method,
        body: data
    });
}
