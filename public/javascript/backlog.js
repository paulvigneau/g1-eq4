
$('#backlog').sortable({
    connectWith: '.sprint',
    update: (event, ui) => {
        if(event.type === 'sortupdate')
            console.log('brrrrrrrr');
        console.log("event update backlog event : " + event.type)
        // let arr = $(event.target).children().toArray();
        // let data = [];
        // for(let i = 0; i<arr.length; i++){
        //     data.push(arr[i].dataset.usId);
        // }
        // let projectId = $(event.target).context.dataset.projectId;
        // $.ajax({
        //     type:'PUT',
        //     url:'/projects/'+projectId+'/backlog/user-story',
        //     dataType: 'json',
        //     data: {
        //         'usList':JSON.stringify(data),
        //         'sprintId': null
        //     }
        // });
    },
    receive: (event, ui) => {
        console.log("event receive backlog event : " + event.type)
        // let usId = ui.item.context.dataset.usId;
        // let to = null;
        // let from = ui.sender.context.dataset.sprintId;
        // let projectId = $(event.target).context.dataset.projectId;
        // $.ajax({
        //     type:'POST',
        //     url:'/projects/'+projectId+'/backlog/user-story',
        //     dataType: 'json',
        //     data: {
        //         'firstSprintId': from,
        //         'secondSprintId': to,
        //         'usId': usId
        //     },
        //     error: (res, status, err) =>{
        //         console.log('Error  : ' + err);
        //     },
            // complete: (res, status) =>{
            //     location.reload();
            // }
        // });
    },
    remove: (event, ui) => {
        console.log("event remove backlog event : " + event.type);
        let usId = ui.item.context.dataset.usId;
        let projectId = $(event.target).context.dataset.projectId;
        $.ajax({
            type:'DELETE',
            url:'/projects/'+projectId+'/backlog/user-story',
            dataType: 'json',
            data: {
                'sprintId': null,
                'usId': usId
            },
            error: (res, status, err) =>{
                console.log('Error  : ' + err);
            },
            // complete: (res, status) =>{
            //     location.reload();
            // }
        });
    }
}).disableSelection();

$('.sprint').sortable({
    connectWith: '.sprint,#backlog',
    update: (event, ui) => {
        console.log("event update sprint event : " + event.type);
        // let arr = $(event.target).children().toArray();
        // let data = [];
        // for(let i = 0; i<arr.length; i++){
        //     data.push(arr[i].dataset.usId);
        // }
        // let sprintId = $(event.target).context.dataset.sprintId;
        // let projectId = $(event.target).context.dataset.projectId;
        // $.ajax({
        //     type:'PUT',
        //     url:'/projects/'+projectId+'/backlog/user-story',
        //     dataType: 'json',
        //     data: {
        //         'usList':JSON.stringify(data),
        //         'sprintId': sprintId
        //     }
        // });
    },
    receive: (event, ui) => {
        console.log("event receive sprint event : " + event.type);
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
            },
            error: (res, status, err) =>{
                console.log('Error  : ' + err);
            },
            // complete: (res, status) =>{
            //     location.reload();
            // }
        });
    },
    remove: (event, ui) => {
        console.log("event remove sprint event : " + event.type)
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
            },
            error: (res, status, err) =>{
                console.log('Error  : ' + err);
            },
            // complete: (res, status) =>{
            //     location.reload();
            // }
        });
    }
}).disableSelection();