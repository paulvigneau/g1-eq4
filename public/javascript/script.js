function togglePopup(id = null) {
    const wrapper = document.querySelector('.pop-up-wrapper');
    const popup = document.querySelector(id ? id : '.pop-up');
    console.log(popup);
    if(wrapper.style.display === 'block') {
        wrapper.style.display = 'none';
        popup.style.display = 'none';
    }
    else {
        wrapper.style.display = 'block';
        popup.style.display = 'block';
    }
}
