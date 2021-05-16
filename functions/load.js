module.exports = () => {
    getDate = require("./utils/getDate");
    getMs = require("./utils/getMs");
    getDuration = require("./utils/getDuration");
    ensure = require("./app/ensure");
    pourcentage = require("./utils/pourcentage");
    reloadAllCache = require("./debug/reloadAllCache")
    deleteCache = require("./debug/deleteCache")
}