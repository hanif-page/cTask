window.addEventListener("load", async () => {
    displayLoaderTask();

    const data = await getTasks()

    if(data.msg) window.location.reload()
    else 
    {
        closeLoaderTask();
        const tasks = data.tasks // the array of task

        const bottomContainer = document.querySelector(".index-content .bottom")
        const clearAllTask = document.querySelector(".index-content .bottom form")
        const taskContainer = document.querySelector(".index-content .all-task")

        if(tasks.length === 0) 
        {
            const noTaskEl = `<p style="color: var(--main-gray); text-align: center;">No Task Added. . .</p>`
            bottomContainer.innerHTML = noTaskEl
        }
        else 
        {
            clearAllTask.classList.remove("hidden")
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
                            <div class="task-name ${checkedClass}">${task.text}</div>
                            <div data-taskid="${task._id}" onclick="deleteTask(this.dataset.taskid)" class="delete-task" style="cursor: pointer">
                                <span class="iconify trash-icon" data-icon="clarity:trash-line"></span>
                            </div>
                        </div>
                    </li>
                    `
                    taskContainer.innerHTML += taskElement
                })
        }
    }
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

const addTask = async () => {
    const text = document.querySelector("input.newTask").value.trim()
    const body = { text: text }

    await getData('/task', { 
        method: "POST", 
        body: JSON.stringify(body),
        headers: { 
            "Content-type": 'application/json'
        } 
    })

    window.location.reload()
}

const deleteTasks = async () => {
    await getData('/task', { method: "DELETE" })

    window.location.reload();
}

const updateTaskChecked = async (taskid, update = true) => {
    await getData(`/task/${taskid}`, {
        method: "PUT",
        body: JSON.stringify({ isChecked: update }),
        headers: {
            "Content-type": 'application/json' 
        } 
    })

    window.location.reload()
}

const deleteTask = async (taskid) => {
    await getData(`/task/${taskid}`, { method: "DELETE" })

    window.location.reload()
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