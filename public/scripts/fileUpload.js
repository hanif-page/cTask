// Register All Plugin 
FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,  
    FilePondPluginImageResize
)

var profilePictPreview = document.querySelector(".profile-content .pp-container img")
var currentPictURL = profilePictPreview.src 

const profilePictInput = document.querySelector("input#pp-fileinput")
const pond = FilePond.create(profilePictInput, {
    imageResizeTargetHeight: 90,
    imageResizeTargetWidth: 90,
    
    labelIdle: "Update your profile picture!",
    
    onaddfile: (err, fileItem) => {
        // console.log(err, fileItem.getMetadata('resize'))
    },
    onpreparefile: (fileItem, output) => {
        profilePictPreview.src = URL.createObjectURL(output)
        profilePictPreview.style = "border: 1px solid var(--success)"
    },
    onremovefile: (error, file) => {
        profilePictPreview.src = currentPictURL
        profilePictPreview.style = "border: none"
    }
})


