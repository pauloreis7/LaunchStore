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
    },

    formatCpfOrCnpj(value) {
        // 11.222.333/4444-55

        value = value.replace(/\D/g, "")

        if (value.length > 14) value = value.slice(0, -1)

        if (value.length > 11) {
            
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5")

        } else {

            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")            
        }

        return value
    },

    formatCep(value) {
        // 12345-123
        
        value = value.replace(/\D/g, "")

        if(value.length > 8 ) value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d{2})/, "$1-$2")

        return value
    }
}

const PhotosUpload = {
    input: "",
    uploadLimit: 6,
    preview: document.querySelector('#photos_preview'),
    files: [],

    handleFileInput(event) {

        const { files: fileList } = event.target
        PhotosUpload.input = event.target
        
        if(PhotosUpload.LimitValidations(event)) return

        Array.from(fileList).forEach( file => {
            
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
        const { files: fileList } = input

        if (fileList.length > uploadLimit || PhotosUpload.files.length + fileList.length > 6) {
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

    PhotosCount (total) {
        const photosTotal = PhotosUpload.files.length

        document.querySelector('.images_title').textContent = `Imagens (${ photosTotal })`
    },

    removeOldPhoto (event) {
        const photoContainer = event.target.parentNode

        if(photoContainer.id) {
            const removedFiles = document.querySelector("input[name='removed_files']")

            if (removedFiles) {
                removedFiles.value += `${ photoContainer.id },`
            }
        }
        
        photoContainer.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),

    setImage (e) {

        const { target } = e

        ImageGallery.previews.forEach( preview => preview.classList.remove('active'))

        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        LightBox.image.src = target.src
    },
}

const LightBox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),

    open() {
        LightBox.target.style.opacity = 1
        LightBox.target.style.top = 0
    },

    close() {
        LightBox.target.style.opacity = 0
        LightBox.target.style.top = "-100%"
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrorsMensages(input)
        
        let results = Validate[func] (input.value)

        if (results) Validate.displayError(input, results)
    },

    displayError(input, error) {
        const errorMensageContainer = document.createElement('div')
        errorMensageContainer.classList.add('error')
        errorMensageContainer.innerHTML = error
        input.parentNode.appendChild(errorMensageContainer)

        input.focus()
    },
    
    clearErrorsMensages(input) {
        const errorContainer = input.parentNode.querySelector('.error')

        if(errorContainer) errorContainer.remove()
    },

    isEmail(value) {
        let error = null
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat)) error = "Email inválido!!"

        return error
    },

    isCpfOrCnpj(value) {
        let error = null

        const clearedValues = value.replace(/\D/g , "")

        if (clearedValues.length > 11 && clearedValues.length !== 14) {
            error = "CNPJ Inválido!!"
        }
        else if (clearedValues.length < 12 && clearedValues.length !== 11) {
            error = "CPF Inválido"
        }

        return error
    },

    isCep(value) {
        let error = null

        const clearedValues = value.replace(/\D/g, "")

        if (clearedValues.length !== 8) error = "CEP Inválido!!"
        
        return error
    },

    allFields(event) {
        let items = document.querySelectorAll(' .item input, .item select, .item textarea')
        const updateFormAction = document.querySelector('.container.form form').action
        
        if(updateFormAction.includes("PUT")) {
            const fileInput = document.querySelector('.item input#photos_input')
            
            items = Array.prototype.slice.call(items)
            items.splice(3, 2)
        }

        for (item of items) {
            if(item.value == "") {
                const errorMessage = document.createElement('div')
                errorMessage.classList.add("messages")
                errorMessage.classList.add("error")
                errorMessage.innerHTML = "Por favor preencha todos os campos!!"
                errorMessage.style.position = "fixed"

                document.querySelector('body').append(errorMessage)
                
                return event.preventDefault()
            }
        }
    }
}