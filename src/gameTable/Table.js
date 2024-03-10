import React from 'react';
import { useState, useEffect } from 'react';
import Player from './Player';
import OurPlayer from './OurPlayer.js';
import './table.css'; // Import the table CSS file
import tableImg from '../assets/emptyTable.png'; // Import the image
import { root } from '../index.js';
import Lobby from '../lobby/lobby.js';
import { leaveTable } from '../serverCalls/Table.js';
import { getPlayersOnTable} from '../serverCalls/Table.js';

// this io is the io from the index.html file on the public folder
<script src="http://127.0.0.1:8080/socket.io/socket.io.js"></script>

function Table(props) {
  const [otherPlayers, setOtherPlayers] = useState(props.table.playersOnTable);
    // fecthData func to get the players on the table from the server (after a user joined the table or left the table ).
    const fetchData = async () => {
      const updatedPlayers = await getPlayersOnTable(props.table.name);
      const updatedOtherPlayers = updatedPlayers.filter(player => player.nickname !== props.user.nickname);
      setOtherPlayers(updatedOtherPlayers);
    };
    // every time we get a render event, we will call the fetchData func and update the state.
    props.socket.off('render').on('render', fetchData);

  const ClickBack = async () => {
    const status = await leaveTable(props.table.name, props.user.nickname);
    if (status === 200) {
      props.socket.emit('leaveTable', props.table.name, props.user.username);
      root.render(<Lobby user={props.user} socket={props.socket} />);
    } else {
      console.log("Error leaving table");
    }
  };

  return (
    <>
      <div className="upper-bg">
        <button className="exit-button" onClick={ClickBack} id="buttonBack">
          Back
        </button>
        <button className="money-amount">
          money: {props.user.moneyAmount}
        </button>
      </div>
      <div className="table">
        <div>
          {/* Background image */}
          <img src={tableImg} alt="Poker Table" className="table-image" />
          {/* Players container */}
          <div className="players">
            {otherPlayers.map((player, index) => (
              <Player key={index} name={player.nickname} className={`player player${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
      <OurPlayer  name={props.user.nickname} className={"our-player"}/>
    </>
  );
}

export default Table;