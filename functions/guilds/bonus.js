module.exports = (type, value, bonus) => {
    if (isNaN(bonus) || bonus <= 1) return value;
    switch(type) {
        case "xp": {
            return Number(value * bonus);
        };
        case "money": {
            return Number(value * bonus);
        };
    }
}