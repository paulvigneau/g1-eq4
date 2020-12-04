const editUsForm = document.querySelector('#edit-us-form');
const sprintForm = document.querySelector('#new-sprint-form');

editUsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new URLSearchParams(new FormData(editUsForm));

    let method = 'POST';
    if (data.get('usId'))
        method = 'PUT';

    // eslint-disable-next-line no-undef
    fetch('backlog/new-user-story', {
        method: method,
        body: data
    })
        .then((resp) => {
            if (resp.status === 400 || resp.status === 404) {
                resp.json().then(text => alert(text.message));
            }
            else {
                editUsForm.reset();
                editUsForm.querySelector('button[type=submit]').textContent = 'Ajouter';
                document.location.reload();
            }
        });
});

sprintForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new URLSearchParams(new FormData(sprintForm));
    // eslint-disable-next-line no-undef
    sendForm('backlog/sprint', data)
        .then((resp) => {
            if (resp.status === 400 || resp.status === 404) {
                resp.json().then(text => alert(text.message));
            }
            else {
                sprintForm.reset();
                document.location.reload();
            }
        });
});

function deleteSprint(projectId, sprintId, force = false) {
    let url = `/projects/${projectId}/backlog/sprints/${sprintId}`;
    if (force)
        url += '?force=true';

    fetch(url, {
        method: 'DELETE'
    }).then((resp) => {
        if (resp.status === 400 || resp.status === 404) {
            resp.json().then(text => alert(text.message));
        }
        else if (resp.status === 401) {
            let result = confirm('Êtes vous sûr de vouloir supprimer ce sprint ?');
            if (result) {
                deleteSprint(projectId, sprintId, true);
            }
        }
        else
            document.location.reload();
    });
}

function closeUS(projectId, sprintId, usId){
    fetch(`/projects/${projectId}/backlog/${sprintId}/${usId}/close`, {
        method: 'PUT'
    })
        .then((resp) => {
            if (resp.status === 400 || resp.status === 404) {
                resp.json().then(text => alert(text.message));
            }
            else
                document.location.reload();
            });
}

function showEditUSPopup(sprintId, usId, description, difficulty) {
    document.querySelector('#edit-user-story #edit-sprintId').value = sprintId === 'null' ? null : sprintId;
    document.querySelector('#edit-user-story #edit-usId').value = usId;
    document.querySelector('#edit-user-story #edit-description').value = description;
    document.querySelector('#edit-user-story #edit-difficulty').value = difficulty;
    document.querySelector('#edit-user-story button[type=submit]').textContent = 'Modifier';

    // eslint-disable-next-line no-undef
    showPopup('#edit-user-story');
}

function showDropdown(USid) {
    hideDropdowns();
    if (!document.querySelector('#dropdown-' + USid).classList.contains('visible')) {
        document.querySelector('#dropdown-' + USid).classList.add('visible');
    }
}

function hideDropdowns() {
    let dropdowns = document.querySelectorAll('.dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('visible')) {
            openDropdown.classList.remove('visible');
        }
    }
}

window.onclick = function(event) {
    if (!event.target.matches('.fas.fa-ellipsis-v')) {
        hideDropdowns();
    }
};

$('#backlog').sortable({
    items: 'div.user-story:not(.unsortable)',
    connectWith: '.sprint',
    update: (event, ui) => {
        let to = null;
        let from = null;
        if (ui.sender)
            from = ui.sender.context.dataset.sprintId;

        update(event, ui, from, to);
    }
}).disableSelection();

$('.sprint').sortable({
    items: 'div.user-story:not(.unsortable)',
    connectWith: '.sprint,#backlog',
    update: (event, ui) => {
        let to = $(event.target).context.dataset.sprintId;
        let from = to;
        if (ui.sender) {
            if (ui.sender.context.className.includes('sprint'))
                from = ui.sender.context.dataset.sprintId;
            else
                from = null;
        }

        update(event, ui, from, to);
    }
}).disableSelection();

function update(event, ui, from, to) {
    let projectId = $(event.target).context.dataset.projectId;
    let index = $(event.target).children().index(ui.item);
    let usId = ui.item.context.dataset.usId;

    if (index === -1)
        return;

    index = $(event.target).children().length - 1 - index;

    $.ajax({
        type: 'PUT',
        url: '/projects/' + projectId + '/backlog/user-story',
        dataType: 'json',
        data: {
            'from': from,
            'to': to,
            'index': index,
            'usId': usId
        },
        error: (res, status, err) => {
            console.log('Response status', status, err);
        },
        complete: (res, status) => {
            location.reload();
        }
    });
}
