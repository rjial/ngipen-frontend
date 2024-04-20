import dayjs from "dayjs"

export const handleDate = (date: string) => {
    return dayjs(date, 'YYYY-MM-DD').format("dddd, DD MMMM YYYY")
}