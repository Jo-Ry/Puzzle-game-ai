'use client'

import settings from "@/app/data/config";
import { useEffect, useState } from "react";
import { TileProps } from "../app/validation";
import Modal from "../modal/Modal";

type BoardProps = {
	tileList: TileProps[]
	initializeNewGame: () => void
}

const Board = ({ tileList, initializeNewGame }: BoardProps) => {
	const [modifiedTileList, setModifiedTileList] = useState<TileProps[]>(tileList);
	const [modal, setModal] = useState<boolean>(false);

	useEffect(() => {
		setModifiedTileList(tileList);
	}, [tileList])

	const handleTileClick = ( clickedTile: TileProps ) => {
		const emptyTile = modifiedTileList.find(tile => tile.is_empty_tile);

		// Handle the case where emptyTile is undefined.
		if (!emptyTile) {
			console.error("empty tile can not be found");
			return
		}

		/*
			Only apply logic for the clicked tile if it is inside the
			the same row or column as the empty tile.
		*/
		const isSameRow = clickedTile.row === emptyTile.row;
		const isSameColumn = clickedTile.column === emptyTile.column;

		if (isSameRow || isSameColumn) {

			// Returns the range between the clicked tile and the empty tile.
			const movableTiles = modifiedTileList.filter(tile => {
				if (isSameRow) {
					const rowItems = tile.row === clickedTile.row;
					const tilesLeftOfEmptyTileToClickedTile = clickedTile.column < emptyTile.column && tile.column >= clickedTile.column && tile.column <= emptyTile.column;
					const tilesRightOfEmptyTileToClickedTile = clickedTile.column > emptyTile.column && tile.column <= clickedTile.column && tile.column >= emptyTile.column;

					return rowItems && (tilesLeftOfEmptyTileToClickedTile || tilesRightOfEmptyTileToClickedTile);
				} else {
					const columnItems = tile.column === clickedTile.column;
					const tilesOverEmptyTileToClickedTile = clickedTile.row < emptyTile.row && tile.row >= clickedTile.row && tile.row <= emptyTile.row;
					const tilesUnderEmptyTileToClickedTile = clickedTile.row > emptyTile.row && tile.row <= clickedTile.row && tile.row >= emptyTile.row;

					return columnItems && (tilesOverEmptyTileToClickedTile || tilesUnderEmptyTileToClickedTile);
				}
			});

			const updatedTiles = modifiedTileList.map(tile => {
				const xAxis = isSameRow && tile.row === clickedTile.row;
				const yAxis = isSameColumn && tile.column === clickedTile.column;
				let updatedTile = tile;

				/*
					Moves a tile in the specific direction within the movableTiles array.

					The parameter 'direction' - Determines the direction to move the tile.
												true => Move towards a higher index ( right/down )
												false => Move towards a lower index ( left/up )

					This function returns the updated tile object with its new number and empty tile status.
				*/
				const moveTile = (direction: boolean) => {
					// Find the index of the current item in the movableTiles array.
					const index = movableTiles.findIndex(movableTile => movableTile.index === tile.index);

					// Check if the title is part of the movableTiles array.
					const affectedTiles = index !== -1;

					if (affectedTiles) {
						if (tile.index === clickedTile.index) {
							/*
								If the tile is the clicked tile,
								it moves the empty tile's number to this position and marks it as the new empty tile.
							*/
							return {
								...tile,
								number: emptyTile.number,
								is_empty_tile: true
							};
						} else {
							/*
								If the tile is not the clicked tile,
								it updated the tile's number based on its adjecent tile's number in the specified direction.
							*/

							// Determine the adjacent tile based on the relative position of the current tile compared to the clicked tile.
							const adjacent = movableTiles[direction ? index + 1 : index - 1]

							return {
								...tile,
								number: adjacent ? adjacent.number : clickedTile.number,
								is_empty_tile: false
							};
						}
					} else {
						// Return the tiles that were not clicked on untouched.
						return tile
					}
				}

				// Move the pieces on X-xis.
				if (xAxis) {
					updatedTile = moveTile(tile.column < clickedTile.column);
				}

				// Move the pieces on Y-axis.
				if (yAxis) {
					updatedTile = moveTile(tile.row < clickedTile.row);
				}

				// return non movable tiles unchanged.
				return updatedTile;
			});

			setModifiedTileList(updatedTiles);

			if (checkForVictory(updatedTiles)) {
				setModal(true);
			}
		}
	};

	/*
		This function returns true if the number for all tiles matches the index, where
		the index can be seen as a position for where the tile are located on the board.
	*/
	const checkForVictory = ( tiles: TileProps[] ) => {
		for (let index = 0; index < tiles.length; index++) {
			if (tiles[index].index !== tiles[index].number) {
				return false;
			}
		}

		return true;
	}

	return (
		<>
			<ul className="board" style={{ gridTemplateColumns: `repeat(${settings.columns}, 1fr)` }}>
				{modifiedTileList.map( property => (
					<li key={property.index} className="board__tile">
						<button
							onClick={() => handleTileClick(property) }
							className={`board__tile-button ${property.index === property.number ? " board__tile-button--correct-postion" : ""}`}
							disabled={property.is_empty_tile}
						>
							<p>{property.number}</p>
						</button>
					</li>
				))}
			</ul>

			{ modal && <Modal setModal={setModal} initializeNewGame={initializeNewGame} /> }
		</>
	)
}

export default Board