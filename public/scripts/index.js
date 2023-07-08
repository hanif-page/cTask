window.addEventListener("load", async () => {
    await updateData();

    // automatically updating data every 30s (not the most effective, bcs it's firing the API all the time without any pause, and keep generating the frontend data too)
    const timeInterval = 20000 // 30s, bcs it's for automatically updating a data on other opened tab.
    setInterval(updateData, timeInterval)
    // Alternative Idea : Check if there any data change from the db, compare it with the last received data. If true, then change data. If false, then do nothing. Maybe create a boolean data on the db, the default is false. When change data, make it true. Then if it's displayed, make it false again.
})

const getData = (url, option = {}) => {
    return fetch(url, option)
            .then(res => res)
            .then(res => res.json())
            .catch(err => err)
}

const getTasks = async () => {
    return await getData('/task', {
        method: "GET"
    })
}

const addTask = async (e, button) => {
    e.preventDefault()

    const text = document.querySelector("input.newTask").value.trim()
    const body = { text: text }

    const success = await getData('/task', { 
        method: "POST", 
        body: JSON.stringify(body),
        headers: { 
            "Content-type": 'application/json'
        } 
    })

    if(success)
    {
        // remove the recent text from the input
        button.querySelector("input").value = ""
    
        await updateData();
    }

}

const deleteTasks = async (e) => {
    e.preventDefault()

    await getData('/task', { method: "DELETE" })

    await updateData();
}

const updateTaskChecked = async (taskid, update = true) => {
    await getData(`/task/${taskid}`, {
        method: "PUT",
        body: JSON.stringify({ isChecked: update }),
        headers: {
            "Content-type": 'application/json' 
        } 
    })

    await updateData();
}

const deleteTask = async (taskid) => {
    await getData(`/task/${taskid}`, { method: "DELETE" })

    await updateData();
}

const editTask = (taskid) => {
    window.location.href = `/edit/${taskid}`
}

// Quick Shortcut to the search bar
window.addEventListener('keydown', (e) => {
    if(e.ctrlKey && e.key === "k")
    {
        e.preventDefault();
        // alert("ctrl + k !!!")
        let searchInput = document.querySelector("input.newTask")
        searchInput.focus()
    }
})

const updateData = async () => {

    displayLoaderTask();

    const data = await getTasks()

    if(data.msg) window.location.reload()
    else 
    {
        closeLoaderTask();
        const tasks = data.tasks // the array of task

        const indexContent = document.querySelector(".index-content")
        const clearAllTask = document.querySelector(".index-content .bottom form")
        const taskContainer = document.querySelector(".index-content .all-task")

        let noTaskSign = document.querySelector(".noTaskSign")
        if(tasks.length === 0) 
        {
            // remove the taskContainer content inside (to make all the task disappear, when the tasks is empty)
            taskContainer.innerHTML = ''

            // if the clearAllTask already hidden, then don't have to make it hidden again, or it will cause multiple "hidden" class
            // make clearAllTask disappeared (set it hidden)
            if(!clearAllTask.classList.contains("hidden")) clearAllTask.classList.add("hidden") 

            if(!noTaskSign) {
                noTaskSign = `<p class="noTaskSign" style="color: var(--main-gray); text-align: center;">No Task Added. . .</p>`
                indexContent.innerHTML += noTaskSign
            }
        }
        else 
        {
            if(noTaskSign) noTaskSign.remove() // if noTaskSign is still there, then remove it

            clearAllTask.classList.remove("hidden") // make the clearAllTask button appears again
            taskContainer.innerHTML = '' // emptying the task container
            
            tasks.forEach(task => {
                let checkedClass = "" 
                if(task.isChecked) checkedClass = "checked"; 
                const taskElement = `
                    <li class="task">
                        <div class="checkbox-container">            
                            <input type="checkbox" onclick="checkboxClicked(this)" ${checkedClass}>
                            <span class="checkmark">
                                <span class="iconify check-icon" data-icon="akar-icons:check"></span>
                            </span>
                        </div>
                    
                        <div class="task-section">
                            <div onclick="window.location.href='/detail/${task._id}'" class="task-name ${checkedClass}">${task.text}</div>
                            <div class="task-option">
                                <div data-taskid="${task._id}" onclick="deleteTask(this.dataset.taskid)" class="delete-task" style="cursor: pointer">
                                    <span class="iconify trash-icon" data-icon="clarity:trash-line"></span>
                                </div>
                                <div data-taskid="${task._id}" onclick="editTask(this.dataset.taskid)" class="edit-task" style="cursor: pointer">
                                    <span class="iconify edit-icon" data-icon="material-symbols:edit"></span>
                                </div>  
                            </div>                          
                        </div>
                    </li>
                    `
                    taskContainer.innerHTML += taskElement
                })
        }
    }
}