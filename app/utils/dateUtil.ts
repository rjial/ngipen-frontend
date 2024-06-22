export const handleDate = (date: string | Date = new Date()) => {
    let dateReturn = typeof date == "string" ? new Date(date) : date instanceof Date ? date : new Date()
    return (new Intl.DateTimeFormat("id-ID", {timeZone: "Asia/Jakarta", weekday: "long", year: "numeric", month: "long", day: "numeric"})).format(dateReturn)
}

export const handleDateTime = (dateTime: string | Date = new Date()) => {
    let dateReturn = typeof dateTime == "string" ? new Date(dateTime) : dateTime instanceof Date ? dateTime : new Date()
    return (new Intl.DateTimeFormat("id-ID", {timeZone: "Asia/Jakarta", weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"})).format(dateReturn)
}

function getLocale() {
    return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
}