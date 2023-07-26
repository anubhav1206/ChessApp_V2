// import { pieceTable } from "./Piece/enum/Pieces.table.enum";
import { colorTable } from "./Piece/enum/Color.table.enum";
// import Bitboard from "$lib/BitArray/Extensions/BitBoard";
import Rook from "./Piece/Pieces/Piece.Rook";
import Pawn from "./Piece/Pieces/Piece.Pawn";
import Knight from "./Piece/Pieces/Piece.Knight";
import Bishop from "./Piece/Pieces/Piece.Bishop";
import Queen from "./Piece/Pieces/Piece.Queen";
import King from "./Piece/Pieces/Piece.King";
import type { move } from "./Moves/move.type";
import type { IBoard } from "./IBoard.interface";
import type { playedMoves } from "./Moves/playedMoves.type";
import { pieceTable } from "./Piece/enum/Pieces.table.enum";
import type { IPiece } from "./Piece/IPiece";
import Chess_API_Visuals from "../API/Visuals/Board.API.Visuals";
import myBot from "$lib/ChessEngine/devBot";
import type { ImyBot } from "$lib/ChessEngine/ImyBot";
import type Chess_API_Humans from "../API/Interactions/Board.API.humans";
import { playStyles } from "./PlayStyles/Board.PlayStyles.enum";
import devBot from "$lib/ChessEngine/devBot";

class ChessBoard implements IBoard {

    private userBot : ImyBot = new myBot(this);
    private devBot : ImyBot = new devBot(this);

        //@ts-ignore
    private playstyle : playStyles;
        //@ts-ignore
    private blackPlayer : ImyBot | string;
        //@ts-ignore
    private whitePlayer : ImyBot | string;

    public readonly playedMoves : playedMoves[] = new Proxy<playedMoves[]>([], {
        set: (target: playedMoves[], property : string, value: number) => {
            if (property === "length") {
                // Handle length property change (e.g., push)
                // You can also add further checks if needed
        
                // Call the RenderPlayedMove function passing the value and the current ChessBoard API
                console.log(target, property,value)
                Chess_API_Visuals.RenderPlayedMoves(this);
                Chess_API_Visuals.RenderPlayedMove(target[value-1], this);
            }

            return Reflect.set(target, property, value);
        },
    }) as playedMoves[]; // Cast the proxy to the desired type (playedMoves[])
    
    public isWhiteToMove: boolean = true;
    public readonly game : IPiece[][] = [
        [new Rook(colorTable.black,"A8"),new Knight(colorTable.black, "B8"), new Bishop(colorTable.black, "C8"), new Queen(colorTable.black, "D8"), new King(colorTable.black, "E7"), new Bishop(colorTable.black, "F8"),new Knight(colorTable.black, "G8"),new Rook(colorTable.black,"H8")],
        [new Pawn(colorTable.black, "A7"),new Pawn(colorTable.black, "B7"),new Pawn(colorTable.black, "C7"),new Pawn(colorTable.black, "D7"),new Pawn(colorTable.black, "E7"),new Pawn(colorTable.black, "F7"),new Pawn(colorTable.black, "G7"),new Pawn(colorTable.black, "H7")],
        [null!, null!, null!, null!, null!, null!, null!, null!],
        [null!, null!, null!, null!, null!, null!, null!, null!],
        [null!, null!, null!, null!, null!, null!, null!, null!],
        [null!, null!, null!, null!, null!, null!, null!, null!],
        [new Pawn(colorTable.white, "A2"),new Pawn(colorTable.white, "B2"),new Pawn(colorTable.white, "C2"),new Pawn(colorTable.white, "D2"),new Pawn(colorTable.white, "E2"),new Pawn(colorTable.white, "F2"),new Pawn(colorTable.white, "G2"),new Pawn(colorTable.white, "H2")],
        [new Rook(colorTable.white,"A1"), new Knight(colorTable.white,"B1"), new Bishop(colorTable.white,"C1"), new Queen(colorTable.white, "D1"), new King(colorTable.white, "E1"), new Bishop(colorTable.white, "F1"),new Knight(colorTable.white, "G1"),new Rook(colorTable.white,"H1")]
    ]
    constructor(playstyle : playStyles) {
        Chess_API_Visuals.RenderNewPLayedMovesContainer();
        this.startGame(playstyle);
    }

    public startGame(playstyle : playStyles) : void {
        function getRandomInteger(min : number, max: number) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        this.playstyle = playstyle;

        // When the playstyle is mybot_vs_mybot
        // Start the match don't care if it is black or white
        if (this.playstyle === playStyles.MyBot_vs_MyBot) {
            this.blackPlayer = this.userBot; 
            this.whitePlayer = this.userBot; 

            this.playMove(this.whitePlayer.Think());

            return;
        }

        // This represents YOU || You're bot
        const yourColor = getRandomInteger(0,1);

        if (yourColor === 0) {
            switch (this.playstyle) {
                case playStyles.Human_vs_MyBot:
                    this.whitePlayer = "Human";
                    this.blackPlayer = this.userBot;
                    break;

                case playStyles.MyBot_vs_DevBot:
                    this.whitePlayer = this.userBot;
                    this.blackPlayer = this.devBot;

                    this.playMove(this.whitePlayer.Think());
                    break;
            }
        }else {
            switch (this.playstyle) {
                case playStyles.Human_vs_MyBot:
                    this.whitePlayer = this.userBot;
                    this.blackPlayer = "Human";

                    this.playMove(this.whitePlayer.Think());

                    break;

                case playStyles.MyBot_vs_DevBot:
                    this.whitePlayer = this.devBot;
                    this.blackPlayer = this.userBot;

                    this.playMove(this.whitePlayer.Think());

                    break;
            }
        }
    }

    makeMove(): void {
        throw new Error("Method not implemented.");
    }
    undoMove() : void {
        throw new Error("Method not implemented.");
    }
    playMove(playingMove : playedMoves):void {
        const position : move = playingMove.substring(0, 2) as move;
        const to : move = playingMove.substring(2, 4) as move;
        const pieceAtPosition : IPiece | null = this.getPieceAtPosition(position);

        if (pieceAtPosition === null) { return;}

        if (pieceAtPosition.legalMoves(this).includes(to)) {
            // Invert the boolean
            this.isWhiteToMove = !this.isWhiteToMove;

            // Push the played move into the array
            //this.playedMoves.push(playingMove);

            // Separate the playingMove into position and to
            
            this.movePiece(position,to);

            

            if (!this.isWhiteToMove) {
                if (this.blackPlayer === "Human") { return;}

                const bot : myBot = this.blackPlayer as myBot;

                

                setTimeout(() => this.playMove(bot.Think()),100);
            }else {
                if (this.whitePlayer === "Human") { return;}
                
                const bot : myBot= this.whitePlayer as myBot;
                
                

                setTimeout(() => this.playMove(bot.Think()),100);
            }
        }else {
            throw new Error(`This ${playingMove} played move isn't valid! Turn: ${this.isWhiteToMove}`);
        }
    }
    


    public getPieceAtPosition(position: move): IPiece | null {
        // Implement logic to find and return the piece at the specified position.
        // If no piece is found, return null.
        const [file, rank] = this.getIndexFileRank(position);

        // Get the piece at the specified position
        const piece = this.game[rank][file];

        // Return the piece if found, otherwise return null
        return piece ? piece : null;
    }

    public getOpponentsLegalMoves() : playedMoves[] {
        const allMoves : playedMoves[] = [];

        for (let i = 0; i < this.game.length; i++) {
            const rankPieces = this.game[i];
            const rank = 8 - i;

            rankPieces.forEach((piece : IPiece, index : number) => {
                // -1. get number ot letter so that you can create the location of the piece
                const letterCode = 65 + index;
                const file = String.fromCharCode(letterCode);    
            
                // 0. evade the null!
                if (piece === null) {return;}
                
                // 0.1. evade the kings? 
                // Not sure if I need to do this and then create some logic for it that I can check that the king doesn't move next to the other king
                // I don't know maybe?
                if (piece.pieceData === pieceTable.King) {return;}

                // 1. Check if the piece is a specific color
                if (this.isWhiteToMove && piece.pieceColor === "1") {
                    // 2. Move on to getting the legal moves
                    let moves : move[] = piece.legalMoves(this);
                    
                    moves.forEach((move : string) => {
                        allMoves.push((file + rank + move) as playedMoves);    
                    });

                } else if (!this.isWhiteToMove && piece.pieceColor === "0"){
                    // 2. Move on to getting the legal moves
                    let moves : move[] = piece.legalMoves(this);
                                        
                    moves.forEach((move : string) => {
                        allMoves.push((file + rank + move) as playedMoves);    
                    });
                }

            });
            
        }

        // 3. Return the legal moves into an array
        return allMoves;
    }
    public getYourLegalMoves() : playedMoves[] {
        const allMoves : playedMoves[] = [];

        for (let i = 0; i < this.game.length; i++) {
            const rankPieces = this.game[i];
            const rank = 8 - i;

            rankPieces.forEach((piece : IPiece, index : number) => {
                // -1. get number ot letter so that you can create the location of the piece
                const letterCode = 65 + index;
                const file = String.fromCharCode(letterCode);    
            
                // 0. evade the null!
                if (piece === null) {return;}

                // 1. Check if the piece is a specific color
                if (this.isWhiteToMove && piece.pieceColor === "0") {
                    // 2. Move on to getting the legal moves
                    let moves : move[] = piece.legalMoves(this);
                    
                    moves.forEach((move : string) => {
                        allMoves.push((file + rank + move) as playedMoves);    
                    });

                } else if (!this.isWhiteToMove && piece.pieceColor === "1"){
                    // 2. Move on to getting the legal moves
                    let moves : move[] = piece.legalMoves(this);
                                        
                    moves.forEach((move : string) => {
                        allMoves.push((file + rank + move) as playedMoves);    
                    });
                }

            });
            
        }
        // 3. Return the legal moves into an array
        return allMoves;
    }
    public isAttackedSquare(square : move) : boolean {
        const mappedMoves : move[] = this.getOpponentsLegalMoves().map(move => move.substring(2, 4)) as move[];

        if (mappedMoves.includes(square)) {
            return true;
        }

        return false;
    }
    
    public hasQueenSideCastling() : boolean{
        let king : IPiece = this.isWhiteToMove ? this.getKing("E1") : this.getKing("E8");
        let rook : IPiece = this.isWhiteToMove ? this.getRook("A1") : this.getRook("A8");

        if (king && rook) {return true;}

        return false;
    }
    public hasKingSideCastling() : boolean {
        let king : IPiece = this.isWhiteToMove ? this.getKing("E1") : this.getKing("E8");
        let rook : IPiece = this.isWhiteToMove ? this.getRook("H1") : this.getRook("H8");
        if (king && rook) {return true;}

        return false;
    }


    /*
    *
    *   **PRIVATES**
    * 
    *   These functions help the repeating behaviors of the board
    *
    */

    
    private getRook(square : move) : IPiece {
        const rook  = this.getPieceAtPosition(square);

            if (!rook) { return null!;}
            if (parseInt(rook.pieceData,2) !== 3) { return null!;}

        return rook;
    }
    private getKing(square : move) : IPiece {
        const king = this.getPieceAtPosition(square);

            if (!king) {return null!;}
            if (parseInt(king.pieceData) !== 5) {return null!;}

        return king;
    }
    private movePiece(fromPosition : move, toPosition : move) {
        // Get piece from the virtual board
        const piece = this.getPieceAtPosition(fromPosition);

        // error if the virtual board doesn't have a piece there
        if (!piece) {
            throw new Error("No piece found at the specified position");
        }


        if (piece.isLegalMove(this, toPosition)) {
            // Move the piece internally
            const [fromFile, fromRank] = this.getIndexFileRank(fromPosition);
            const [toFile, toRank] = this.getIndexFileRank(toPosition);

            // Remove the piece from the original position and place it at the new position
            this.game[fromRank][fromFile] = null!;
            this.game[toRank][toFile] = piece;

            this.playedMoves.push((fromPosition+toPosition) as playedMoves);

            // Update the piece's location
            piece.location = toPosition;
        } else {
            // If move is invalid return null
            throw new Error("Invalid Move");
        }
    }
    

    private getIndexFileRank(position : move) : [number, number] {
        const [file, rank] = position;
        // console.log(position, file , rank)
         // Find the indices for the 'game' array based on the file and rank
        const fileIndex = file.charCodeAt(0) - "A".charCodeAt(0);
        const rankIndex =  8 - parseInt(rank);

        return [fileIndex, rankIndex];
    }



}

export default ChessBoard;