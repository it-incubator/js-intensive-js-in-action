const _state = {
    settings: {
        gridSize: {
            rowsCount: 4,
            columnsCount: 5
        }
    },
    positions: {
        google: {
            x: 2, y: 2
        },
        players: [{x:0,y:0}, {x: 4, y: 3}]
    },
    points: {
        google: 10,
        players: [8, 110]
    }
}

function _getPlayerIndexByNumber(playerNumber) {
    const playerIndex = playerNumber - 1;

    if (playerIndex < 0 || playerIndex > _state.points.players.length - 1) {
        throw new Error('Incorrect player number')
    }
    return playerIndex;
}

// INTERFACE/ADAPTER
export async function getGooglePoints() {
    return _state.points.google
}

/**
 *
 * @param {number} playerNumber - one-based index of player
 * @returns {Promise<number>} number of points
 */
export async function getPlayerPoints(playerNumber) {
    const playerIndex = _getPlayerIndexByNumber(playerNumber)

    return _state.points.players[playerIndex]
}

export async function getGridSize() {
    return {..._state.settings.gridSize}
}

export async function getGooglePosition() {
    return {..._state.positions.google}
}

export async function getPlayerPosition(playerNumber) {
    const playerIndex = _getPlayerIndexByNumber(playerNumber)

    return {..._state.positions.players[playerIndex]}
}

