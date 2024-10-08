import React, { useState, useEffect } from 'react';
import { root } from '../index.js';
import GameTable from '../gameTable/GamePage.js';
import '../App.css';
import logo from '../assets/logo.png';
import Login from '../login/login.js';
import Swal from 'sweetalert2';
import Add_Money_Page from '../Add_Money_Page/Add_Money_Page.js';
import { GetAllTables } from '../serverCalls/lobby.js';
import { enterTable } from '../serverCalls/lobby.js';
import Add_Table_Page from '../Add_Table_Page/Add_Table_Page.js'
import Statistics from '../Statistics/Statistics.js';

const serverIP = process.env.REACT_APP_SERVER_IP;
const serverPort = process.env.REACT_APP_SERVER_PORT;
const socketSrcURL = `http://${serverIP}:${serverPort}/socket.io/socket.io.js`;

// this io is the io from the index.html file on the public folder
<script src={socketSrcURL}></script>

/* Sending "alert" like message to the screen */
export function sendSwal(message, icon) {
  Swal.fire({
    text: message,
    icon: icon,
  });
}

function Lobby(props) {
  const [tablesList, setTablesList] = useState([]);

  /* Getting all the tables from DB using server call */
  const fetchTables = async () => {
    try {
      const tables = await GetAllTables();
      setTablesList(tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  /* fetch the tables when opening this page */
  useEffect(() => {
    fetchTables();
  }, []);

  /* refetch the tables by clicking */
  const refresh = () => {
    fetchTables();
  };

  const clickBack = () => {
    props.socket.emit('exit', props.user.username);
    root.render(<Login />);
  };

  /* Entering a table using server call */
  const GenericClickTable = async (tableName, event) => {
    const inputFieldPassword = event.target.parentElement.nextElementSibling.querySelector('input');
    let password = inputFieldPassword ? inputFieldPassword.value : '';
    const [table, retStatus] = await enterTable(tableName, password, props.user.username);
    if (retStatus === 200) {
      props.socket.emit('joinScreenTable',tableName, props.user.username,props.user.nickname);
      props.socket.off('getLocalTable').on('getLocalTable',  playersArray => {
        let Localtable = {
          name: tableName,
          Players: playersArray,
        };
        root.render(<GameTable table={Localtable} user={props.user} socket={props.socket} />);
      });
    } else if (retStatus === 404) {
      sendSwal("Incorrect password, try again.", "error");
    }
  };

  /* This variable holds the table of tables */
  const TagTableList = tablesList.map((table, index) => (
    <tr key={index}>
      <td>{table.name}</td>
      <td>{table.createdBy}</td>
      <td>{table.numOfPlayers}/{5}</td>
      <td>{table.smallBlind}/{table.bigBlind}</td>
      <td>
        <button className="tr-button" onClick={(event) => GenericClickTable(table.name, event)}>Join table</button>
      </td>
      <td>
        {table.password !== '' ? <input
          type="password"
          className="form-control"
          id={table.id}
        /> : null}
      </td>
    </tr>
  ));

  const addMoney = () => {
    root.render(<Add_Money_Page user={props.user} socket={props.socket} />);
  };

  const addTable = () => {
    if (tablesList.length >= 4) {
      sendSwal("Can not add more than 4 tables.", "error");
    } else {
      root.render(<Add_Table_Page user={props.user} socket={props.socket} />);
    }
  };

  const goToStat = () => {
    root.render(<Statistics user={props.user} socket={props.socket} />);
  };

  return (
    <>
      <div className="upper-bg">
        <button className="exit-button" onClick={clickBack} id="buttonBack">
          Back
        </button>
        <button className="money-amount">
          Current money: {props.user.moneyAmount}$
        </button>
      </div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container form-container-extention p-4 rounded in-Login form-container-lobby">
          <header className="reg-head text-center mb-4">
            Tables lobby
            <br></br>
            <button className="refresh-button" onClick={refresh}>Refresh</button>
            <button className="add-money" onClick={addMoney} id="addMoneyButtonHeader">Add Money</button>
            <button className="add-table-btn" onClick={addTable} id="addTableButton">Add Table</button>
            <button className="statistics-btn" onClick={goToStat} id="addTableButton">Statistics</button>
          </header>
          <div className="lobby-table">
            <table>
              <thead>
                <tr>
                  <th>Table name</th>
                  <th>Created by</th>
                  <th>Number of players</th>
                  <th>Small/Big blind</th>
                  <th>Join</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>{TagTableList}</tbody>
            </table>
          </div>
        </div>
        <div className="image-container">
          <img src={logo} alt="Dealer" className="logo-image" />
        </div>
      </div>
    </>
  );
}

export default Lobby;
