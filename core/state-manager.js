import {GAME_STATUSES} from './constants.js';

const _state = {
    gameStatus: GAME_STATUSES.SETTINGS,
    settings: {
        /**
         * in milliseconds
         */
        googleJumpInterval: 2000,
        gridSize: {
            rowsCount: 5,
            columnsCount: 5
        },
        pointsToLose: 2,
        pointsToWin: 3
    },
    positions: {
        google: {
            x: 2, y: 3
        },
        players: [{x:0,y:0}, {x: 1, y: 1}]
    },
    points: {
        google: 0,
        players: [0, 0]
    }
}

// OBSEREVER
let _observers = []
export function subscribe(observer) {
    _observers.push(observer)
}
export function unsubscribe(observer) {
    _observers = _observers.filter(o => o !== observer)
}
function _notifyObservers() {
    _observers.forEach(o => {
        try {
            o();
        } catch(error) {
            console.error(error)
        }
    })
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function _generateIntegerNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _jumpGoogleToNewPosition() {
    const newPosition = {..._state.positions.google}

    do {
        newPosition.x = _generateIntegerNumber(0, _state.settings.gridSize.columnsCount - 1)
        newPosition.y = _generateIntegerNumber(0, _state.settings.gridSize.rowsCount - 1)

        var isNewPositionMatchWithCurrentGooglePosition = newPosition.x === _state.positions.google.x && newPosition.y === _state.positions.google.y
        var isNewPositionMatchWithCurrentPlayer1Position = newPosition.x === _state.positions.players[0].x && newPosition.y === _state.positions.players[0].y
        var isNewPositionMatchWithCurrentPlayer2Position = newPosition.x === _state.positions.players[1].x && newPosition.y === _state.positions.players[1].y
    } while (isNewPositionMatchWithCurrentGooglePosition || isNewPositionMatchWithCurrentPlayer1Position || isNewPositionMatchWithCurrentPlayer2Position)

    _state.positions.google = newPosition
}

function _getPlayerIndexByNumber(playerNumber) {
    const playerIndex = playerNumber - 1;

    if (playerIndex < 0 || playerIndex > _state.points.players.length - 1) {
        throw new Error('Incorrect player number')
    }
    return playerIndex;
}

let googleJumpInterval;





// INTERFACE/ADAPTER
export async function getGooglePoints() {
    return _state.points.google
}

export async function start() {
    if (_state.gameStatus !== GAME_STATUSES.SETTINGS) throw new Error(`Incorrect transition from "${_state.gameStatus}" to "${GAME_STATUSES.IN_PROGRESS}"`)

    _state.positions.players[0] = {x: 0, y: 0};
    _state.positions.players[1] = {x: _state.settings.gridSize.columnsCount - 1, y: _state.settings.gridSize.rowsCount - 1};
    _jumpGoogleToNewPosition();

    _state.points.google = 0;
    _state.points.players = [0,0];

    googleJumpInterval = setInterval(() => {
        _jumpGoogleToNewPosition()
        _state.points.google++;

        if (_state.points.google === _state.settings.pointsToLose) {
            clearInterval(googleJumpInterval)
            _state.gameStatus = GAME_STATUSES.LOSE;
        }

        _notifyObservers();
    }, _state.settings.googleJumpInterval)

    _state.gameStatus = GAME_STATUSES.IN_PROGRESS;
    _notifyObservers();
}

export async function playAgain() {
    _state.gameStatus = GAME_STATUSES.SETTINGS;
    _notifyObservers();
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
export async function getGameStatus() {
    return _state.gameStatus
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



