import {getGridSize, subscribe} from '../../../core/state-manager.js';
import {CellComponent} from './Cell/Cell.component.js';

export function GridComponent() {
    console.log('GRID COMPONENT CREATING')
    const element = document.createElement('table');
    element.classList.add('grid')

    subscribe(() => {
        render(element);
    })

    render(element);

    return {element};
}

async function render(element) {
    console.log('GRID COMPONENT RENDERING')
     element.innerHTML = '';
     const gridSizePromise = getGridSize();
     const gridSize = await gridSizePromise;

    for (let y = 0; y < gridSize.rowsCount; y++) {
        const rowElement = document.createElement('tr')

        for (let x = 0; x < gridSize.columnsCount; x++) {
            const cellComponent = CellComponent(x, y);
            rowElement.append(cellComponent.element);
        }

        element.append(rowElement)
    }
}
