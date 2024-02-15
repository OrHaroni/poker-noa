
import React from 'react';
import Player from './Player';
import './table.css'; // Import the table CSS file
import tableImg from '../assets/emptyTable.png'; // Import the image
import { root } from '../index.js';
import Login from '../login/login.js';

function Table(props) {
    const ClickBack = () => {
        root.render(<Login />);
      };
    // Array to hold the Player components
    const players = [];

    // Use a for loop to generate Player components
    for (let i = 0; i < props.players_num; i++) {
        players.push(
            <Player key={i} name={`Player ${i + 1}`} className={`player player${i + 1}`} />
        );
    }

    return (
        <>
        <button className='exit-button' onClick={ClickBack}>Back</button>
        <div className="table">
            <div>
                {/* Background image */}
                <img src={tableImg} alt="Poker Table" className="table-image" />
                {/* Players container */}
                <div className="players">
                    {players}
                </div>
            </div>
        </div>
        </>
    );
}

export default Table;