const memberForm = document.querySelector('#new-member-form');

memberForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new URLSearchParams(new FormData(memberForm));
    // eslint-disable-next-line no-undef
    sendForm(window.location.href + '/member', data)
        .then((resp) => {
            if (resp.status === 400 || resp.status === 404) {
                resp.json().then(text => alert(text.message));
            }
            else
                document.location.reload();
        });
});

async function deleteMember(projectId, memberId) {
    await fetch(`/projects/${projectId}/members/${memberId}`, {
        method: 'DELETE'
    })
        .then((resp) => {
            if (resp.status === 400 || resp.status === 404) {
                resp.json().then(text => alert(text.message));
            }
            else
                document.location.reload();
        });
}
