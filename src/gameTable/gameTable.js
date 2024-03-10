import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './gameTable.css'; // Import the CSS file
import Table from './Table'; // Import the Table component
import Modal from 'react-modal';
import { root } from '../index.js';
import Lobby from '../lobby/lobby.js';
import { joinUserIntoTable } from '../serverCalls/lobby.js';
import { sendSwal } from '../lobby/lobby.js';
import { io } from 'socket.io-client';

// this io is the io from the index.html file on the public folder
<script src="http://127.0.0.1:8080/socket.io/socket.io.js"></script>





function GameTable(props) {
    const [showModal, setShowModal] = useState(false);
    const [money, setMoney] = useState(0);
    const moneyRef = useRef(0);

    useEffect(() => {
        setShowModal(true); // Open the modal when the component mounts
    }, []); // Empty dependency array to run the effect only once

    const ClickEnter = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent default form submission
          ClickEnterGame();
        }
      };

    const ClickEnterGame = async () => {

        const moneyToEnterWith = moneyRef.current.value;
        const tableName = props.table.name;
        const username = props.user.username;

        const retStatus= await joinUserIntoTable(tableName, username, moneyToEnterWith);
        if(retStatus === 200) {
            // if the status is good, we want to use socket io to send the server joinTable event, to make all other players on that table to render the table.
            props.socket.emit('joinTable', tableName, username);
            setShowModal(false);
        }
        else if (retStatus === 301) {
            sendSwal("You dont have enough money!", "error");
        }
        else if( retStatus === 302) {
            sendSwal("This table is full!", "error");
        }
        else {
            sendSwal("Unknown problem, 404", "error");
        }
        
    };

    const ClickBack =  async () => {
        root.render(<Lobby user={props.user} socket={props.socket}/>);
        }

    return (
        <>
            <Modal isOpen={showModal} className="form-container p-4 rounded modal-center">
                <button className="exit-button modal-back-button" onClick={ClickBack} id="buttonBack">
                    Back
                </button>
                <div className="modal-content">
                    <h2>Enter Amount</h2>
                    <input
                        type="text"
                        value={money}
                        onKeyDown={ClickEnter}
                        onChange={(e) => {
                            const input = e.target.value;
                            if (/^\d*$/.test(input)) { // Only allow digits
                                setMoney(input);
                            }
                        }}
                        ref={moneyRef}
                    />
                    <button onClick={ClickEnterGame}>Enter Game</button>
                </div>
            </Modal>
            <Container className="container">
                <Row>
                    <Col>
                        {/* Render the Table component up to 4*/}
                        <Table table={props.table} user={props.user} players_num={4} socket={props.socket}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default GameTable;
