/**
 * Retourne une date sous le format voulu.
 * @params {Date|Number} date La date ou le timestamp.
 * @params {String} format Le format. YYYY: ann�e, MM: mois, DD: jours, hh: heures, mm: minutes, ss: secondes. Attention des crochets doivent entourer les formats. Exemple: [DD]/[MM]/[YYYY]
 * @returns {String}
 */
module.exports = (date, format) => {
    const dateObj = new Date(date - (24 * 60 * 60 * 1000));
    const times = { "YYYY": dateObj.getFullYear(), "MM": dateObj.getMonth() + 1, "DD": dateObj.getUTCDate() + 1, "hh": dateObj.getHours(), "mm": dateObj.getMinutes(), "ss": dateObj.getSeconds(), "ms": dateObj.getMilliseconds() };
    return format.replace(/\[(YYYY|MM|DD|hh|mm|ss|ms)\]/g, (_, m) => times[m].toString().padStart(2, "0"));
};