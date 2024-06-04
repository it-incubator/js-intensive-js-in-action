import {getGooglePoints, getPlayerPoints, subscribe} from '../../../core/state-manager.js';

export function ResultPanelComponent() {
    const element = document.createElement('div');

    element.classList.add('result-panel');

    subscribe(() => {
        render(element);
    })

    render(element);

    return {element};
}

async function render(element) {
    element.innerHTML = ''

    const googlePoints = await getGooglePoints()
    const player1Points = await getPlayerPoints(1)
    const player2Points = await getPlayerPoints(2)

    element.append(`Player1: ${player1Points}, Player2: ${player2Points}, Google: ${googlePoints}`)
}

