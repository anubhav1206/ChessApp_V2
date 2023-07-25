import type ChessBoard from "$lib/ChessBoard/Core/Board";
import type { playedMoves } from "$lib/ChessBoard/Core/Moves/playedMoves.type";
import type Chess_API_Visuals from "../Visuals/Board.API.Visuals";

class Chess_API_Bots {
    public readonly API : ChessBoard;

    constructor(board : ChessBoard) {
        this.API = board;
    }
}


export default Chess_API_Bots