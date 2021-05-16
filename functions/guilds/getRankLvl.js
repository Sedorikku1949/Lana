module.exports = () => {
    let minXpActually = 2000
    let nextRankXp = 2000
    let list = {}
    for (let a = 1; a < 6; a++) {
        list[a] = {}
        for ( let b = 1; b <= 20; b++ ) {
            list[a][b] = (list[a][b - 1] ? list[a][ b - 1] * 1.2 : b !== 1 ? minXpActually * 1.2 : nextRankXp).toFixed(0)
            if ( b == 1 ) nextRankXp = nextRankXp * 1.75
            minXpActually = list[a][b]
        }
    }
    return list
}