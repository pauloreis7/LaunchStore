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
    uploadLimit: 6,
    preview:  document.querySelector('#photos_preview'),


    handleFileInput(event) {

        const { files: filesList } = event.target

        if(PhotosUpload.LimitValidations(event, filesList)) return
        

        Array.from(filesList).forEach( file => {
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)
                
                const container = PhotosUpload.createCotainer(image)
                
                PhotosUpload.preview.appendChild(container)        
                
                const totalImages = document.querySelectorAll('.photo').length
                document.querySelector('.images_title').textContent = `Imagens (${ totalImages })`
            }

            reader.readAsDataURL(file)
        })
    },

    createCotainer(image) { 

        const container = document.createElement("div")
        container.classList.add('photo')
        
        container.onclick = () => alert("Cliquei!!")
        container.appendChild(image)

        return container
    },

    LimitValidations(event, filesList) {

        const { uploadLimit } = PhotosUpload

        if (filesList.length > uploadLimit) {
            alert(`Selecione no máximo ${ uploadLimit } fotos!!`)

            event.preventDefault()
            return true
        }

        return false
    }
}