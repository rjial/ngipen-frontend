export const blobToBase64 = async (blob: Blob) => {
    let buffer = Buffer.from(await blob.arrayBuffer())
    return "data:" + blob.type + ";base64," + buffer.toString("base64")   
}