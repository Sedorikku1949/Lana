module.exports = (file) => {
    return new Promise((resolve, reject) => {
        if (typeof file !== "object" || !Array.isArray(file)) throw new Error("Files names must be an Array")
        file.forEach(e => {
            try { delete require.cache[require.resolve(e)] } catch(err) {}
        });
        resolve(true)
    })
}