export const handleCurrency = (nominal: number | string) => {
    return (new Intl.NumberFormat('id-ID', {style: "currency", currency: "IDR"})).format(Number(nominal))
}