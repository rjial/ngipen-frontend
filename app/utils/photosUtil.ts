const dataPhotos = [
    "https://source.unsplash.com/JNuKyKXLh8U",
    "https://source.unsplash.com/kcJsQ3PJrYU",
    "https://source.unsplash.com/Q_KdjKxntH8",
    "https://source.unsplash.com/U7HLzMO4SIY",
    "https://source.unsplash.com/LETdkk7wHQk",
]

export const getRandomPhoto = () => {
    return dataPhotos[Math.floor(Math.random() * dataPhotos.length | 0)]
}

export const getRandomPhotos = () => {
    return dataPhotos.sort((a, b) => 0.5 - Math.random())
}

export const getItemPhoto = (index: number) => {
    if (index > dataPhotos.length - 1) throw new Error("Index out of array")
    return dataPhotos[index]
}