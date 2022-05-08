const checkboxClicked = async (checkbox) => {

    // get the taskID from the delete btn element
    const taskID = checkbox.parentElement.parentElement.querySelector(".delete-task").dataset.taskid
    if(checkbox.checked)
    {
        await updateTaskChecked(taskID, true)

        checkbox.parentElement.parentElement.querySelector(".task-name").classList.add("checked")
    }
    else 
    {
        await updateTaskChecked(taskID, false)

        checkbox.parentElement.parentElement.querySelector(".task-name").classList.remove("checked")
    }
}