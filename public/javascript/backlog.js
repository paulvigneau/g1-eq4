async function deleteSprint(projectId, sprintId) {
    await fetch(`/projects/${projectId}/backlog/sprints/${sprintId}`, {
        method: 'DELETE'
    });

    document.location.reload();
}

$('#backlog').sortable({
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
            console.log('Response status ' + status + ' : ' + err);
        },
        complete: (res, status) => {
            console.log(from, to, index, usId);
            location.reload();
        }
    });
}
