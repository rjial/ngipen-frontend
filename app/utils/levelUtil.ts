export const levelName = (level: string): string => {
    let levelReturn: string = ""
    switch(level) {
        case "USER":
            levelReturn = "User"
            break
        case "ADMIN":
            levelReturn = "Administrator"
            break
        case "PEMEGANG_ACARA":
            levelReturn = "Pemegang Acara"
            break
        default:
            levelReturn = "User"
            break
    }
    return levelReturn
}