const closeErrBanner = document.querySelectorAll(".banner .close-icon")
const loaderPage = document.querySelector(".loaderPageContainer")
const loaderTask = document.querySelector(".loaderTaskContainer")

closeErrBanner.forEach(close => {
    close.addEventListener("click", () => {
        close.parentElement.remove()
    })
})

const displayLoaderPage = () => {
    loaderPage.classList.remove("hidden")
}

const closeLoaderPage = () => {
    loaderPage.classList.add("hidden")
}

const displayLoaderTask = () => {
    loaderTask.classList.remove("hidden")
}

const closeLoaderTask = () => {
    loaderTask.classList.add("hidden")
}

window.addEventListener("load", () => {
    closeLoaderPage()
})