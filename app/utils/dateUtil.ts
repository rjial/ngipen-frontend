import dayjs from "dayjs"

export const handleDate = (date: string | Date = new Date()) => {
    let dateReturn = typeof date == "string" ? new Date(date) : date instanceof Date ? date : new Date()
    return (new Intl.DateTimeFormat("id-ID", {timeZone: "Asia/Jakarta", weekday: "long", year: "numeric", month: "long", day: "numeric"})).format(dateReturn)
}

export const handleDateTime = (dateTime: string) => {
    return dayjs(dateTime, 'YYYY-MM-DD HH:mm').format("dddd, DD MMMM YYYY HH:mm")
}

function getLocale() {
    return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
}