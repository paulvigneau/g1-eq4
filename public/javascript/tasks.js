const taskForm = document.querySelector('#edit-task-form');

(function () {
    taskForm.querySelector('#edit-type').onchange();
})();

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
    const option = document.createElement('option');
    option.text = member.name;
    const select = document.querySelector('select[id="edit-members"]');
    select.appendChild(option);
}

function renderMembers(projectMembers){
    cleanMembersOptions();
    const type = getCurrentType();
    const membersList = filterMembersByRole(projectMembers, type);
    for (let i = 0; i < membersList.length; i++) {
        createMemberOption(membersList[i]);
    }
}

function getCurrentType(){
    return document.querySelector('select[id="edit-type"]').value;
}

function checkMemberRoleTaskType(memberRole, taskType){
    return (memberRole === 'Testeur' && taskType === 'TEST')
        || (memberRole === 'Développeur' && taskType === 'DEV')
        || (taskType === 'GEN');
}

function filterMembersByRole(projectMembers, type){
    return projectMembers.filter(member => checkMemberRoleTaskType(member.role, type));
}
