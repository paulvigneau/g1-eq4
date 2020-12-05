const taskForm = document.querySelector('#edit-task-form');

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new URLSearchParams(new FormData(taskForm));
    // eslint-disable-next-line no-undef
    sendForm('/tasks', data)
        .then((resp) => {
            if (resp.status === 400) {
                resp.json().then(text => alert(text.message));
            }
            else
                document.location.reload();
        });
});

function cleanMembersOptions(){
    let select = document.querySelector('select[id="edit-members"]');
    let length = select.options.length - 1;
    for(let i = length; i >= 0; i--) {
        select.options.remove(i);
    }
}

function createMemberOption(member){
    let option = document.createElement('option');
    option.text = member.name;
    let select = document.querySelector('select[id="edit-members"]');
    select.appendChild(option);
}

function renderMembers(projectMembers){
    return function(event) {
        console.log('test');
        console.log(projectMembers)
        cleanMembersOptions();
        let type = getCurrentType();
        let membersList = filterMembersByRole(projectMembers, type);
        for (let i = 0; i < membersList.length; i++) {
            createMemberOption(membersList[i]);
        }
    }
}

function getCurrentType(){
    return document.querySelector('select[id="edit-type"]').value;
}

function checkMemberRoleTaskType(memberRole, taskType){
    if(memberRole === 'Développeur' && taskType === 'DEV'){
        return true;
    }
    if(memberRole === 'Testeur' && taskType === 'TEST'){
        return true;
    }
    return false;
}

function filterMembersByRole(projectMembers, type){
    return projectMembers.filter(member => checkMemberRoleTaskType(member.role, type));
}