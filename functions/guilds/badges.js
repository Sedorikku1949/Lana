/**
 * 1 = amoureux
 * 2 = farmeur d'xp
 * 3 = farmeur d'argent
 * 4 = staff
 * 5 = ami du staff
 * 6 = amoureux d'un staff
 * 7 = participe à l'amélioration du serveur
 * 8 = rateaux ( amour )
 */

module.exports = (array) => {
    const str = array.map(e => e.replace(/1|2|3|4|5|6|7/g, (a,b) => {
        switch(a) {
            case "1": return "💖 amoureux(se)"
            case "2": return "✨ expert(e) de l'xp"
            case "3": return "💸 l'argent c'est la vie"
            case "4": return "👨‍✈️ staff un jour, staff pour toujours"
            case "5": return "✌ un(e) ami(e)s du staff"
            case "6": return "💕 une relation spéciale"
            case "7": return "😉 aide le serveur"
            case "8": return "💔 ca fait mal, un rateau"
        }
    }))
    return str
}