import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  . 
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 * Returns:
 * - on win condition: a win message
 * - if win condition is not met: 
 *    <table /> -> <tbody /> -> <trow />-> <Cell />
 * 
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 * 
 *  App -> Board -> Cell
 **/
function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = .25}){

    //state to manage board in play
    const [board, setBoard] = useState(createBoard);

    /** creates board nrows high/ncols wide */
    function createBoard(){
        const initialBoard = [];
        for(let i = 0; i < nrows; i++){
            //create an arr that is ncols elements long
            //this will be our row, a subarr within the initialBoard arr
            const row = Array(ncols);
            
            //this fills the row with ncols number of true booleans
            row.fill(true);

            //put the row of trues into the board arr
            initialBoard.push(row);
        }
        //update board state with board that has randomly flipped Cells
        setBoard(flipRandomCells(initialBoard));
    }

    /** Flips a cell and the four cells around it (top, right, bottom, left) 
     * 
     * Arguments: 
     * - coord: a str of coordinates for a <Cell />, row and column
     *      like "2-5" (`${y}-${x}` or `${row}-${col}`)
     * 
     * Returns:
     * - a deep copy of the board but with the selected <Cell /> 
     *   and its surrounding Cells flipped
     */
    function flipCellsAround(coord){
        //split coord str on "-"
        //map over them, converting each part of the coord to a #
       const [y, x] = coord.split("-").map(Number);

       //if this coord is actually on board, flip it
       //this is just a function expression; an anon arrow fn saved to a variable
       //can be called like: flipCell(y, x, boardCopy)
       const flipCell = (y, x, boardCopy) => {
        if (y >= 0 && y < nrows && x >= 0 && x < ncols){
            boardCopy[y][x] = !boardCopy[y][x];
            //since each Cell is a bool in a subarr,
            //this will flip the bool to its opposite bool
        }
       }

       //we need to give the board we're going to update a new identity
       //a deep copy, not a shallow copy
       //or else React won't detect any changes (ref would otherwise be same)
       const newBoard = board.map(row => [...row]);
       //need to spread each subarr/row, otherwise newBoard = [...board]
       //would just be a new arr of refs to the old subarrs

       //now flip the selected Cell and its surrounding Cells
       flipCell(y, x, newBoard);
       flipCell(y - 1, x, newBoard);
       flipCell(y + 1, x, newBoard);
       flipCell(y, x - 1, newBoard);
       flipCell(y, x + 1, newBoard);

       return newBoard;
    }
  
    /** Randomly flips Cells (and their surrounding Cells) on a board 
     * 
     * Arguments: 
     * - board: the current game board, array-of-arrays of true/false
     * 
     * Returns:
     * - a deep copy of the board but with random flipped Cells
     */
    function flipRandomCells(board){
        for(let row = 0; row < nrows; row++){
            for(let col = 0; col < ncols; col++){
                if(Math.random() > chanceLightStartsOn){
                    flipCellsAround(`${row}-${col}`);
                }
            }
        }
    }

    /** Checks for game win condition
     * 
     * Arguments: 
     * - board: the state of the board in play
     * 
     * Returns:
     * - boolean: 
     *      true if all Cells are true/flipped/"on"
     *      false if any Cells are false/unflipped/"off"
     */
    function hasWon(board){
        for(let row of board){
            if(row.contains(false) === true){
                return false;
            }
        }
        return true;
    }

   return (
       <div className="Board board container">
           { hasWon() === false &&
               <table className="board table">
                   <tbody className="board">
                        { board.map((row, rowIdx) =>
                            <tr key={rowIdx} className="board row">
                                { row.map((col, colIdx) => 
                                    <Cell 
                                        key={`${rowIdx}-${colIdx}`}
                                        flipCellsAroundMe={evt => flipCellsAround(`${rowIdx}-${colIdx}`)}
                                        isLit={board[rowIdx][colIdx]}
                                    />    
                                )}
                            </tr>
                        )}
                    </tbody> 
                    {/* don't forget the tbody in the table! otherwise annoying errors pop up */}
               </table>
           }
           { hasWon() === true &&
                <div className="Board winMsg container">
                    <p className="winMsg">
                        "You've won! Congrats on being a CHAMPION!"
                    </p>
                </div>
           }
       </div>
    )
}


export default Board;
