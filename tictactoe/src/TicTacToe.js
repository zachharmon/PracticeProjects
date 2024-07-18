import React, { useState, useEffect } from "react";

const TicTacToe = ({board=['', '', '', '', '', '', '', '', ''], winnerCallback, clickCell}) => {

    const [winline, setWinline] = useState([]);

    useEffect(() => {
        let winner = null;
        if (board[0] === board[1] && board[1] === board[2] && board[0] !== '') {
            winner = board[0];
            setWinline([0, 1, 2]);
        } else if (board[3] === board[4] && board[4] === board[5] && board[3] !== '') {
            winner = board[3];
            setWinline([3, 4, 5]);
        } else if (board[6] === board[7] && board[7] === board[8] && board[6] !== '') {
            winner = board[6];
            setWinline([6, 7, 8]);
        } else if (board[0] === board[3] && board[3] === board[6] && board[0] !== '') {
            winner = board[0];
            setWinline([0, 3, 6]);
        } else if (board[1] === board[4] && board[4] === board[7] && board[1] !== '') {
            winner = board[1];
            setWinline([1, 4, 7]);
        } else if (board[2] === board[5] && board[5] === board[8] && board[2] !== '') {
            winner = board[2];
            setWinline([2, 5, 8]);
        } else if (board[0] === board[4] && board[4] === board[8] && board[0] !== '') {
            winner = board[0];
            setWinline([0, 4, 8]);
        } else if (board[2] === board[4] && board[4] === board[6] && board[2] !== '') {
            winner = board[2];
            setWinline([2, 4, 6]);
        }
        else if (!board.includes('')) {
            winner = 'draw';
            setWinline("draw");
        }

        if (winner) {
            winnerCallback(winner);
        }
    }, [board]);

    return (
        <div
        style={{
            textAlign: 'center',
        }}
        >
            <h1>Tic Tac Toe</h1>
            <div>
                <div
                style={{
                    display: winline.length > 0 ? 'none' : 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridGap: 10,
                    width: 300,
                    margin: '0 auto',
                    textAlign: 'center',
                }}
                >
                {
                    board.map((cell, index) => {
                        return <div key={index}
                        style={{
                            width: 100,
                            height: 100,
                            border: '1px solid black',
                            fontSize: 24,
                            lineHeight: '100px',
                        }}
                        onClick={() => clickCell(index)}
                        >{cell}</div>
                    })
                }
                </div>

                {
                    (winline.length > 0 && winline !== "draw") && (
                        <div>
                            <h2>Winner!</h2>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gridGap: 10,
                                    width: 300,
                                    margin: '0 auto',
                                    textAlign: 'center',
                                }}
                            >
                                {
                                    board.map((cell, index) => {
                                        return <div key={index}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                border: '1px solid black',
                                                fontSize: 24,
                                                lineHeight: '100px',
                                                color: winline.includes(index) ? 'red' : 'black',
                                            }}
                                        >{cell}</div>
                                    })
                                }
                            </div>
                        </div>
                    )
                }

                {
                    winline === "draw" && (
                        <div>
                            <h2>Draw!</h2>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gridGap: 10,
                                    width: 300,
                                    margin: '0 auto',
                                    textAlign: 'center',
                                }}
                            >
                                {
                                    board.map((cell, index) => {
                                        return <div key={index}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                border: '1px solid black',
                                                fontSize: 24,
                                                lineHeight: '100px',
                                            }}
                                        >{cell}</div>
                                    })
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    );
}

export default TicTacToe;