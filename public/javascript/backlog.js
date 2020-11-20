
$('#backlog').sortable({
    connectWith: '.sprint',
    update: (event, ui) => {
        let to = null;
        let from = null;
        if(ui.sender)
            from = ui.sender.context.dataset.sprintId;

        let projectId = $(event.target).context.dataset.projectId;
        let index = $(event.target).children().index(ui.item);
        let usId = ui.item.context.dataset.usId;
        $.ajax({
            type:'PUT',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'from':from,
                'to': to,
                'index': index,
                'usId':usId
            },
            error: (res, status, err) =>{
                console.log('Response status '+status+' : '+err);
            },
            complete: (res, status) =>{
                location.reload();
            }
        });
    }
}).disableSelection();

$('.sprint').sortable({
    connectWith: '.sprint,#backlog',
    update: (event, ui) => {
        let to = $(event.target).context.dataset.sprintId;
        let from = to;
        if(ui.sender){
            if(ui.sender.context.className.includes('sprint'))
                from = ui.sender.context.dataset.sprintId;
            else
                from = null;
        }
        
        let projectId = $(event.target).context.dataset.projectId;
        let index = $(event.target).children().index(ui.item);
        let usId = ui.item.context.dataset.usId;
        $.ajax({
            type:'PUT',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'from':from,
                'to': to,
                'index': index,
                'usId':usId
            },
            error: (res, status, err) =>{
                console.log('Response status '+status+' : '+err);
            },
            complete: (res, status) =>{
                location.reload();
            }
        });
    }
}).disableSelection();