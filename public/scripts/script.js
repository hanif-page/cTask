const closeErrBanner = document.querySelectorAll(".banner .close-icon")

closeErrBanner.forEach(close => {
    close.addEventListener("click", () => {
        close.parentElement.remove()
    })
})