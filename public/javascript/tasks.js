function checkMemberRoleTaskType(memberRole, taskType){
    if(memberRole === 'Développeur' && taskType === 'DEV'){
        return true;
    }
    if(memberRole === 'Testeur' && taskType === 'TEST'){
        return true;
    }
    return false;
}

function filterMembersByRole(projectMembers, task){
    return projectMembers.filter(member => checkMemberRoleTaskType(member.role, task.type));
}