const checkboxes = document.querySelectorAll(".checkbox-container input")
checkboxes.forEach(checkbox => {
    checkbox.addEventListener("click", () => {
        if(checkbox.checked)
        {
            checkbox.parentElement.parentElement.querySelector(".task-name").classList.add("checked")
        }
        else 
        {
            checkbox.parentElement.parentElement.querySelector(".task-name").classList.remove("checked")
        }
    })
})