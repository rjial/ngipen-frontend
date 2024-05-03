import dayjs from "dayjs"

export const handleDate = (date: string) => {
    return dayjs(date, 'YYYY-MM-DD').format("dddd, DD MMMM YYYY")
}

export const handleDateTime = (dateTime: string) => {
    return dayjs(dateTime, 'YYYY-MM-DD HH:mm').format("dddd, DD MMMM YYYY HH:mm")
}