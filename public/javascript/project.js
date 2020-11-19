async function deleteMember(projectId, memberId) {
    await fetch(`/projects/${projectId}/members/${memberId}`, {
        method: 'DELETE'
    });

    document.location.reload();
}
