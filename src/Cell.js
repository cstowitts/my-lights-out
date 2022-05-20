import "./Cell.css";

/** A single cell on the board
 *
 * Properties:
 * - flipCellsAroundMe: the cb triggered when the Cell is clicked,
 *   flips a cell and its surrounding Cells
 * - isLit: a boolean noting if the Cell is lit
 *
 * State:
 * - no state
 *
 * Returns:
 * - a <td> element, a Cell
 *      if cell is "lit"/true, the classes "Cell lit" will be added
 *      if cell is "unlit"/false, the class "Cell" alone will be added
 *  
 * This handles clicks --- by calling flipCellsAroundMe
 * Key for each Cell is created in Board, in the return (.map)
 **/
function Cell({flipCellsAroundMe, isLit}){
    const classes = `Cell ${isLit ? "lit" : ""}`
    //from solution--tasty ternary within a str interpolation!
    //will eval to `Cell lit` or `Cell`

    return (
        <td className={classes} onClick={flipCellsAroundMe}></td>
    )
}

export default Cell;
