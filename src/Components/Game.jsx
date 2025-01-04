import * as deck from '@letele/playing-cards';
import './Game.css';
import { useState } from 'react';
import PropTypes from 'prop-types';
import red_token from '../Assets/Red_Token.png'
import blue_token from '../Assets/Blue_Token.png'
import green_token from '../Assets/Green_Token.png'
import empty_token from '../Assets/Empty.png'
import { ToastContainer, toast } from 'react-toastify';

const Game = ({players}) => {

    const teams = players%3==0?3:2;

    const [Index, setIndex] = useState(0);

    const colors = ['red', 'blue', 'green'];

    const sequence_board = [
        [{card: 'J1', color: 'none'}, {card: 'S2-1', color: 'none'}, {card: 'S3-1', color: 'none'}, {card: 'S4-1', color: 'none'}, {card: 'S5-1', color: 'none'}, {card: 'S6-1', color: 'none'}, {card: 'S7-1', color: 'none'}, {card: 'S8-1', color: 'none'}, {card: 'S9-1', color: 'none'}, {card: 'J1', color: 'none'}],
        [{card: 'C6-1', color: 'none'}, {card: 'C5-1', color: 'none'}, {card: 'C4-1', color: 'none'}, {card: 'C3-1', color: 'none'}, {card: 'C2-1', color: 'none'}, {card: 'Ha-1', color: 'none'}, {card: 'Hk-1', color: 'none'}, {card: 'Hq-1', color: 'none'}, {card: 'H10-1', color: 'none'}, {card: 'S10-1', color: 'none'}],
        [{card: 'S7-2', color: 'none'}, {card: 'Sa-1', color: 'none'}, {card: 'D2-1', color: 'none'}, {card: 'D3-1', color: 'none'}, {card: 'D4-1', color: 'none'}, {card: 'D5-1', color: 'none'}, {card: 'D6-1', color: 'none'}, {card: 'D7-1', color: 'none'}, {card: 'H9-1', color: 'none'}, {card: 'Sq-1', color: 'none'}],
        [{card: 'S8-2', color: 'none'}, {card: 'Sk-1', color: 'none'}, {card: 'C6-2', color: 'none'}, {card: 'C5-2', color: 'none'}, {card: 'C4-2', color: 'none'}, {card: 'C3-2', color: 'none'}, {card: 'Dq-1', color: 'none'}, {card: 'D8-1', color: 'none'}, {card: 'H8-1', color: 'none'}, {card: 'Sk-2', color: 'none'}],
        [{card: 'C9-1', color: 'none'}, {card: 'Sq-2', color: 'none'}, {card: 'C7-1', color: 'none'}, {card: 'H6-1', color: 'none'}, {card: 'H5-1', color: 'none'}, {card: 'H4-1', color: 'none'}, {card: 'Ha-2', color: 'none'}, {card: 'D9-1', color: 'none'}, {card: 'H7-1', color: 'none'}, {card: 'Sa-2', color: 'none'}],
        [{card: 'C10-1', color: 'none'}, {card: 'S10-2', color: 'none'}, {card: 'C8-1', color: 'none'}, {card: 'H7-2', color: 'none'}, {card: 'H2-1', color: 'none'}, {card: 'H3-1', color: 'none'}, {card: 'Hk-2', color: 'none'}, {card: 'D10-1', color: 'none'}, {card: 'H6-2', color: 'none'}, {card: 'D2-2', color: 'none'}],
        [{card: 'Sq-3', color: 'none'}, {card: 'S9-2', color: 'none'}, {card: 'C9-2', color: 'none'}, {card: 'H8-2', color: 'none'}, {card: 'H9-2', color: 'none'}, {card: 'H10-2', color: 'none'}, {card: 'Hq-2', color: 'none'}, {card: 'Dq-2', color: 'none'}, {card: 'H5-2', color: 'none'}, {card: 'D3-2', color: 'none'}],
        [{card: 'Sk-3', color: 'none'}, {card: 'S8-3', color: 'none'}, {card: 'C10-2', color: 'none'}, {card: 'Cq-1', color: 'none'}, {card: 'Ck-1', color: 'none'}, {card: 'Ca-1', color: 'none'}, {card: 'Da-1', color: 'none'}, {card: 'Dk-1', color: 'none'}, {card: 'H4-2', color: 'none'}, {card: 'D4-2', color: 'none'}],
        [{card: 'Ca-2', color: 'none'}, {card: 'S7-4', color: 'none'}, {card: 'S6-2', color: 'none'}, {card: 'S5-2', color: 'none'}, {card: 'S4-2', color: 'none'}, {card: 'S3-2', color: 'none'}, {card: 'S2-2', color: 'none'}, {card: 'H2-2', color: 'none'}, {card: 'H3-2', color: 'none'}, {card: 'D5-2', color: 'none'}],
        [{card: 'J1', color: 'none'}, {card: 'Da-2', color: 'none'}, {card: 'Dk-2', color: 'none'}, {card: 'Dq-3', color: 'none'}, {card: 'D10-2', color: 'none'}, {card: 'D9-2', color: 'none'}, {card: 'D8-2', color: 'none'}, {card: 'D7-2', color: 'none'}, {card: 'D6-2', color: 'none'}, {card: 'J1', color: 'none'}]
    ];

    const [Board, setBoard] = useState(sequence_board);

    const win = (color) => toast(`${color} Team Wins!`);

    const WinCheck = (color, newBoard) => {        
        // check rows
        for (let i = 0; i < 10; i++) {
            let count = 0;
            for (let j = 0; j < 10; j++) {
                if (newBoard[i][j].color === color) {
                    count++;
                } else {
                    count = 0;
                }

                if (count == 5) {
                    return true;
                }
            }
        }

        // check columns
        for (let i = 0; i < 10; i++) {
            let count = 0;
            for (let j = 0; j < 10; j++) {
                if (newBoard[j][i].color === color) {
                    count++;
                } else {
                    count = 0;
                }

                if (count === 5) {
                    return true;
                }
            }
        }

        // check main diagonal
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                let count = 0;
                for (let k = 0; k < 5; k++) {
                    if (newBoard[i + k][j + k].color === color) {
                        count++;
                    } else {
                        count = 0;
                    }

                    if (count === 5) {
                        return true;
                    }
                }
            }
        }

        // check anti diagonal
        for (let i = 0; i < 6; i++) {
            for (let j = 4; j < 10; j++) {
                let count = 0;
                for (let k = 0; k < 5; k++) {
                    if (newBoard[i + k][j - k].color === color) {
                        count++;
                    } else {
                        count = 0;
                    }

                    if (count === 5) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    const HandleCardClick = (card) => {
        const color = colors[Index%teams];
        
        const newBoard = Board.map((row) =>
            row.map((cell) => {

                if (cell.card === card && cell.color === 'none') {
                    setIndex(Index + 1);
                    return { ...cell, color: colors[Index%teams]};
                }

                return cell;
            })
        );

        setBoard(newBoard);
        if(WinCheck(color, newBoard)){
            win(color);
            setInterval(() => {
                window.location.reload();
            }
            , 3000);
        }
    };

    return (
        
        <div className="board">
            <ToastContainer />

            <div className='heading1'>SEQUENCE</div>
            <div className='heading2'>SEQUENCE</div>

            <div className='token_grid'>
                {Board.map((row, rowIndex) => (
                    <div key={rowIndex} className="token-row">
                        {row.map((cell, cellIndex) => {
                            if (cell.color === 'red') {
                                return <img onClick={() => HandleCardClick(cell.card)} key={`${rowIndex}-${cellIndex}`} src={red_token} alt='red_token' className='token' />
                            } else if (cell.color === 'blue') {
                                return <img onClick={() => HandleCardClick(cell.card)} key={`${rowIndex}-${cellIndex}`} src={blue_token} alt='blue_token' className='token' />
                            } else if (cell.color === 'green') {
                                return <img onClick={() => HandleCardClick(cell.card)} key={`${rowIndex}-${cellIndex}`} src={green_token} alt='green_token' className='token' />
                            } else {
                                return <img onClick={() => HandleCardClick(cell.card)} key={`${rowIndex}-${cellIndex}`} src={empty_token} alt='nothing' className='token' />
                            }
                        })}
                    </div>
                ))}
            </div>

            <div className="cards">
                {Board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, cellIndex) => {
                            const cardName = cell.card.split('-')[0];
                            const CardComponent = deck[cardName];

                            return (
                                <CardComponent
                                    key={`${rowIndex}-${cellIndex}`}
                                    onClick={() => HandleCardClick(cell.card)}
                                    className="one_card"
                                    style={{ height: '100%', width: '100%' }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

Game.propTypes = {
    players: PropTypes.number.isRequired,
};

export default Game;