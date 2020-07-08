const Mask = {
    apply(input, func) {

        setTimeout(function () {

            input.value = Mask[func] (input.value)

        }, 1)
    },

    formatBRL(value) {

        value = value.replace(/\D/g, "")
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', 
            currency: 'BRL' 
        }).format(value/100)
    }
}

const PhotosUpload = {
    input: "",
    uploadLimit: 6,
    preview: document.querySelector('#photos_preview'),
    files: [],

    handleFileInput(event) {

        const { files: filesList } = event.target
        PhotosUpload.input = event.target
        
        if(PhotosUpload.LimitValidations(event)) return        

        Array.from(filesList).forEach( file => {
            
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const container = PhotosUpload.createCotainer(image)
                
                PhotosUpload.preview.appendChild(container)
            }

            reader.readAsDataURL(file)
        })
        
        PhotosUpload.PhotosCount()

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    createCotainer(image) { 

        const container = document.createElement("div")
        container.classList.add('photo')
        
        container.appendChild(image)

        container.appendChild(PhotosUpload.RemoveButton())

        return container
    },

    RemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "delete_forever"

        button.onclick = PhotosUpload.RemovePhoto

        return button
    },

    LimitValidations(event) {

        const { uploadLimit, input } = PhotosUpload

        if (input.files.length > uploadLimit) {
            alert(`Selecione no máximo ${ uploadLimit } fotos!!`)

            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles () {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files

    },

    RemovePhoto (event) {
        const photoContainer = event.target.parentNode // .photo
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoContainer)

        PhotosUpload.files.splice(index, 1)
        
        PhotosUpload.PhotosCount()
        
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoContainer.remove()
    },

    PhotosCount () {
        const totalImages = PhotosUpload.files.length
        document.querySelector('.images_title').textContent = `Imagens (${ totalImages })`
    }
}