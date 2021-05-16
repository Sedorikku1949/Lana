module.exports = (ms) => {
    if (typeof ms !== "string") return false
    const format = ms.slice(ms.length - 1).toLowerCase()
    switch (format) {
        case "d": return Number(ms.slice(0, (ms.length - 1))) * 24 * 60 * 60 * 1000
        case "h": return Number(ms.slice(0, (ms.length - 1))) * 60 * 60 * 1000
        case "m": return Number(ms.slice(0, (ms.length - 1))) * 60 * 1000
        case "s": return Number(ms.slice(0, (ms.length - 1))) * 1000
    }
}