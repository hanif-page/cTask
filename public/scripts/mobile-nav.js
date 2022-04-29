const openMobileNav = document.querySelector("#open-mobileNav")
const closeMobileNav = document.querySelector("nav .close-icon")
const mobileNav = document.querySelector("nav.mobile-nav") 

openMobileNav.addEventListener("click", () => {
    mobileNav.classList.toggle("opened")
})

closeMobileNav.addEventListener("click", () => {
    mobileNav.classList.toggle("opened")
})
