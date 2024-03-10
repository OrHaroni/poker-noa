import React, { useState, useEffect } from 'react';
import { root } from '../index.js';
import GameTable from '../gameTable/gameTable';
import '../App.css';
import logo from '../assets/logo.png';
import Login from '../login/login.js';
import Swal from 'sweetalert2';
import Add_Money_Page from '../Add_Money_Page/Add_Money_Page.js';
import { GetAllTables } from '../serverCalls/lobby.js';
import { enterTable } from '../serverCalls/lobby.js';
import Add_Table_Page from '../Add_Table_Page/Add_Table_Page.js'

// Initialize the socket connection


// this io is the io from the index.html file on the public folder
<script src="http://127.0.0.1:8080/socket.io/socket.io.js"></script>


// later on !!!! user socket to render the tables,render the amout of players on the table...

export function sendSwal(message, icon) {
  /* eslint-disable no-undef */
  Swal.fire({
    text: message,
    icon: icon,
  });
}

function Lobby(props) {
  const clickBack = () => {
    root.render(<Login />);
  };
  const GenericClickTable = async (tableName, event) => {
    const inputFieldPassword = event.target.parentElement.nextElementSibling.querySelector('input');
    let password;
    if(inputFieldPassword) {
      password = inputFieldPassword.value
    }
    else {
      password = '';
    }

    //Check if correct password of table.
    const [table, retStatus] = await enterTable(tableName, password, props.user.username);
    if(retStatus === 200) {
      // if the status is good, we want to use socket io to send all the players to the table to render the table.
      props.socket.emit('joinTable', tableName, props.user.username);
      root.render(<GameTable table={table} user={props.user} socket={props.socket} />);
    }
    else if(retStatus === 404) {
      sendSwal("Incorrect password, try again.", "error");
    }
  };

  // List that demonstrates all the rows of the open tables
  // later on will get it from the DB 

  const [tablesList, setTablesList] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tables = await GetAllTables();
        setTablesList(tables);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

// Initialize TagTableList inside the useEffect hook
const TagTableList = tablesList.map((table, index) => (
  <tr key={index}>
    <td>{table.name}</td>
    <td>{table.createdBy}</td>
    <td>{table.playersOnTable.length}/{table.max_players_num}</td>
    <td>{table.moneyAmountOnTable}</td>
    <td>{table.smallBlind}/{table.bigBlind}</td>
    <td>
    <button className="tr-button" onClick={(event) => GenericClickTable(table.name, event)}>Join table</button>
    </td>
    <td>
      {table.password !== '' ? <input
        // onKeyDown={ClickRegister}
        type="password"
        className="form-control"
        id={table.id}
      /> : null}
    </td>
  </tr>
));


  // Function to handle adding money
  const addMoney = () => {
    // need to past socket because i need the socket back when i want to go back to the lobby in the Add_Money_Page
    root.render(<Add_Money_Page user={props.user} socket={props.socket} />);
  };

  const addTable = () => {
    // need to past socket because i need the socket back when i want to go back to the lobby in the Add_Table_Page
   root.render(<Add_Table_Page user={props.user} socket={props.socket} />);
  }
  return (
    <>
      <div className="upper-bg">
        <button className="exit-button" onClick={clickBack} id="buttonBack">
          Back
        </button>
        <button className="money-amount">
          Current money: {props.user.moneyAmount}
        </button>
      </div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container form-container-extention p-4 rounded in-Login">
          <header className="reg-head text-center mb-4">
            Tables lobby
            <br></br>
            {/* Move the "Add Money" button inside the header */}
            <button className="add-money" onClick={addMoney} id="addMoneyButtonHeader">Add Money</button>
            <button className="add-table-btn" onClick={addTable} id="addTableButton">Add Table</button>
          </header>
          <div className="lobby-table">
            <table>
              <thead>
                <tr>
                  <th>Table name</th>
                  <th>Created by</th>
                  <th>Number of players</th>
                  <th>Money on the table</th>
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
