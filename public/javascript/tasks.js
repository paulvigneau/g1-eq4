const taskForm = document.querySelector('#edit-task-form');

let selectedDependencies = [];
let dependencies = [];
let tasks = [];

(function () {
    taskForm.querySelector('#edit-type').onchange();
    getTasks().then((t) => tasks = t);
})();

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new URLSearchParams(new FormData(taskForm));
    data.set('dependencies', dependencies);
    data.set('dodValues', getDodValues().toString());

    let method = 'POST';
    if (data.get('taskId'))
        method = 'PUT';

    // eslint-disable-next-line no-undef
    sendForm('tasks', data, method)
        .then((resp) => {
            if (resp.status === 400) {
                resp.json().then(text => alert(text.message));
            }
            else {
                taskForm.reset();
                document.location.reload();
            }
        });
});

function getTasks() {
    return fetch('tasks/json')
        .then((res) => res.json())
        .then(json => {
            tasks = json.tasks;
            return tasks;
        });
}

function displayTasks() {
    let div = document.querySelector('#taskList');
    div.innerHTML = '';

    for (let task of tasks) {
        let classes = 'border mb-2 p-2 dependency-task';
        if (dependencies.find(d => task._id === d))
            classes += ' selected';
        const t =
            `<div class="${classes}" 
                  onclick="toggleSelectDependency('${task._id}')"
                  id="task-${task._id}">
                ${task.description}
            </div>`;
        div.insertAdjacentHTML('beforeend', t);
    }
}

function displayDependencies() {
    let div = document.querySelector('#dependencies');
    div.innerHTML = '';

    for (let d of dependencies) {
        let task = tasks.find(t => d === t._id);
        const t =
            `<div class="dependency-task border">
                ${task.description}
            </div>`;
        div.insertAdjacentHTML('beforeend', t);
    }
}

function showDependencies() {
    selectedDependencies = dependencies;
    displayTasks();

    const wrapper = document.querySelector('.pop-up-wrapper2');
    const popup = document.querySelector('#pop-up-dependencies');
    wrapper.style.display = 'block';
    popup.style.display = 'block';
}

function closeDependencies(save = false) {
    const wrapper = document.querySelector('.pop-up-wrapper2');
    const popup = document.querySelector('#pop-up-dependencies');
    wrapper.style.display = 'none';
    popup.style.display = 'none';

    if (save) {
        dependencies = selectedDependencies;
        displayDependencies();
    }
}

function toggleSelectDependency(id) {
    if (document.querySelector(`#task-${id}`).classList.contains('selected')) {
        document.querySelector(`#task-${id}`).classList.remove('selected');
        let i = selectedDependencies.findIndex(t => t === id);
        selectedDependencies.splice(i, 1);
    }
    else {
        document.querySelector(`#task-${id}`).classList.add('selected');
        selectedDependencies.push(id);
    }
}

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
    option.value = member._id;
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

    document.querySelector('select[id="edit-members"]')
        .insertAdjacentHTML('afterbegin', '<option value="" selected>Non assignée</option>');
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

function getDodValues() {
    const values = [];
    let checkboxes = document.querySelectorAll('.definition-of-done input[type=checkbox]');
    for (let c of checkboxes)
        values.push(c.checked);

    return values;
}

function getCurrentNbDod(divDod){
     return divDod.childElementCount;
}

function createDod(dodLine, checked){
    let divDod = document.querySelector('.definition-of-done');
    let iDiv = document.createElement('div');
    iDiv.className = 'custom-control custom-checkbox';

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'custom-control-input';
    input.checked = checked;
    const checkId = 'check' + (getCurrentNbDod(divDod) + 1);
    input.id = checkId;

    iDiv.appendChild(input);

    let label = document.createElement('label');
    label.className = 'custom-control-label';
    label.htmlFor = checkId;
    label.innerText = dodLine;

    iDiv.appendChild(label);

    divDod.appendChild(iDiv);
}

function getChecklistDodByType(projectDod, taskType){
    if(taskType === 'GEN'){
        return projectDod.gen.checklist;
    }
    if(taskType === 'DEV'){
        return projectDod.dev.checklist;
    }
    if(taskType === 'TEST'){
        return projectDod.test.checklist;
    }
    return null;
}

function cleanDod(){
    document.querySelector('.definition-of-done').innerHTML = '';
}

function renderDod(projectDod){
    const id = document.querySelector('#edit-taskId').value;
    const task = id ? tasks.find(t => t._id === id) : null;

    cleanDod();
    const taskType = getCurrentType();
    const currentDod = getChecklistDodByType(projectDod, taskType);
    for(let i = 0; i < currentDod.length; i++){
        const dodLine = currentDod[i];
        createDod(dodLine, task ? task.checklist[i] : false);
    }

}

function showTaskPopup() {
    document.querySelector('#edit-type').onchange();
    document.querySelector('#edit-members').value = '';

    dependencies = [];
    displayDependencies();

    // eslint-disable-next-line no-undef
    showPopup('#add-task');
}

function showEditTaskPopup(task) {
    document.querySelector('#edit-taskId').value = task._id;
    document.querySelector('#edit-description').value = task.description;
    document.querySelector('#edit-cost').value = task.cost;

    document.querySelector('#edit-type').value = task.type;
    document.querySelector('#edit-type').onchange();
    document.querySelector('#edit-members').value = task.member ? task.member : '';

    dependencies = task.dependencies ? task.dependencies : [];
    displayDependencies();

    // TODO Display USList

    // eslint-disable-next-line no-undef
    showPopup('#add-task');
}
