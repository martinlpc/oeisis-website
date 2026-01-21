export function useCloudinaryUpload() {
    const uploadImage = async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            const data = await response.json()

            if (data.secure_url) {
                return data.secure_url
            } else {
                throw new Error('Error uploading image')
            }
        } catch (error) {
            console.error('Upload error:', error)
            throw error
        }
    };

    return { uploadImage }
}