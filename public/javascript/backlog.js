
$('#backlog').sortable({
    connectWith: '.sprint',
    update: (event, ui) => {
        console.log("event update backlog")
        let arr = $(event.target).children().toArray();
        let data = [];
        for(let i = 0; i<arr.length; i++){
            data.push(arr[i].dataset.usId);
        }
        let projectId = $(event.target).context.dataset.projectId;
        $.ajax({
            type:'PUT',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'usList':JSON.stringify(data),
                'sprintId': null
            }
        });
    },
    receive: (event, ui) => {
        console.log("event receive backlog")
        let usId = ui.item.context.dataset.usId;
        let to = $(event.target).context.dataset.sprintId;
        let from = ui.sender.context.dataset.sprintId;
        let projectId = $(event.target).context.dataset.projectId;
        $.ajax({
            type:'POST',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'firstSprintId': from,
                'secondSprintId': null,
                'usId': usId
            }
        });
    },
    remove: (event, ui) => {
        console.log("event remove backlog")
        let usId = ui.item.context.dataset.usId;
        let projectId = $(event.target).context.dataset.projectId;
        $.ajax({
            type:'DELETE',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'sprintId': null,
                'usId': usId
            }
        });
    }
}).disableSelection();

$('.sprint').sortable({
    connectWith: '.sprint,#backlog',
    update: (event, ui) => {
        console.log("event update sprint")
        let arr = $(event.target).children().toArray();
        let data = [];
        for(let i = 0; i<arr.length; i++){
            data.push(arr[i].dataset.usId);
        }
        let sprintId = $(event.target).context.dataset.sprintId;
        let projectId = $(event.target).context.dataset.projectId;
        $.ajax({
            type:'PUT',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'usList':JSON.stringify(data),
                'sprintId': sprintId
            }
        });
    },
    receive: (event, ui) => {
        console.log("event receive sprint")
        let usId = ui.item.context.dataset.usId;
        let to = $(event.target).context.dataset.sprintId;
        let from = null;
        if(ui.sender.context.className.includes('sprint'))
            from = ui.sender.context.dataset.sprintId;
        let projectId = $(event.target).context.dataset.projectId;
        $.ajax({
            type:'POST',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'firstSprintId': from,
                'secondSprintId': to,
                'usId': usId
            }
        });
    },
    remove: (event, ui) => {
        console.log("event remove sprint")
        let sprintId = $(event.target).context.dataset.sprintId;
        let usId = ui.item.context.dataset.usId;
        let projectId = $(event.target).context.dataset.projectId;
        $.ajax({
            type:'DELETE',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'sprintId': sprintId,
                'usId': usId
            }
        });
    }
}).disableSelection();