function togglePopup() {
    const e = document.querySelector('.pop-up-wrapper');
    if(e.style.display === 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}
