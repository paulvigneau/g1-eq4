const projectForm = document.querySelector('#new-project-form');

projectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new URLSearchParams(new FormData(projectForm));
    // eslint-disable-next-line no-undef
    sendForm('/project', data)
        .then((resp) => {
            if (resp.status === 400) {
                resp.json().then(text => alert(text.message));
            }
            else
                document.location.reload();
        });
});
