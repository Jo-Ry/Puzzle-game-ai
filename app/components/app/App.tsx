'use client'

import { useCallback, useEffect, useState } from "react"
import { TileProps } from "./validation";
import settings from "@/app/data/config";
import Board from "../board/Board";


const App = () => {
    const [ tiles, setTiles ] = useState<TileProps[]>([]);

    const initializeNewGame = useCallback(() => {

        /*
            Step 1:

            By using the 2-dimensional technique, i can identify each tile's position by its
            own column and row. This is critical for determining wich tiles are affected
            when moving a tile. It also provides the correct number of tiles needed
            for the next step, as the numbers need to be randomized seperately.

            Also by putting this logic inside a function and then RETURNING the modified array
            Typescripts inherently understand the type structure it has, hence i dont need
            to manually specify the type like 'TileProps'.
        */
		const gridCoordinates = () => {
            const coordinates = [];

            for (let column = 0; column < settings.columns; column++) {
                for (let row = 0; row < settings.rows; row++) {
                    coordinates.push({
                        row: row + 1,
                        column: column + 1
                    })
                }
            }

            return coordinates;
        }

        /*
            Step 2:

            By mapping trough the newly updated coordinates array, i can apply the following logic:
                2.1:
                    Returns a new array with the numbers specified by the index.
                2.2:
                    By having this array seperated instead of just adding it in the first
                    iteration (step 1), lets me randomize the numbers without altering
                    the 'column' and 'rows' information as that data should remain the same!
                2.3
                    Sort the grid coordinates array by row to ensure correct tile positions
                    in the grid / board.
                2.4
                    After that, i merge the two arrays with some additional data. Resulting in a
                    new array with the structure for each tile where the numbers are shuffled but
                    each tile retains its correct positional information, plus some additional data.
        */

        // Step 2.1:
		const tileNumbers = gridCoordinates().map((_, index) => ({ number: index + 1 }));
		console.log("🚀 ~ initializeNewGame ~ tileNumbers:", tileNumbers)

        // Step 2.2:
		const shuffledTileNumbers = tileNumbers.sort(() => Math.random() - 0.5);

        // Step 2.3:
        const sortedGridCoordinates = [...gridCoordinates()].sort(( tileA, tileB ) => tileA.row - tileB.row )

		// Step 2.4:
        const initialTileSetup = shuffledTileNumbers.map((value, index) => ({
            index: index + 1, // The index specifying where each tile exists on the board.
			...value, // The shuffled numbers.
			...sortedGridCoordinates[index], // The placement of the tiles.
            is_empty_tile: value.number === shuffledTileNumbers.length ? true : false // Identify the empty tile
		}));

        setTiles(initialTileSetup);
    console.log("🚀 ~ initializeNewGame ~ initialTileSetup:", initialTileSetup)
    }, [])
    

    useEffect(() => {
        initializeNewGame()
    },[initializeNewGame])

    return (
        <div className="site-content">
            <Board tileList={tiles} initializeNewGame={initializeNewGame}/>
            <p className="hint">
                <span>Orange</span> Färg indikerar att den är på rätt plats!
            </p>
            <button onClick={() => initializeNewGame() }> Slumpa </button>
        </div>
    )
}

export default App