import React, { useRef } from 'react';
import '../App.css';
import Lobby, { sendSwal } from '../lobby/lobby.js';
import { root } from '../index.js';
import { addMoney } from '../serverCalls/Add_Money_page.js';

function Add_Money_Page(props) {

  const ClickBack = () => {
    root.render(<Lobby user={props.user} socket={props.socket} />);
  };

  const moneyAmountRef = useRef(null);

  const handleAddMoney = async () => {
  const selectedAmount = moneyAmountRef.current.value;

  if (selectedAmount !== '') {
    const [updatedUser, status] = await addMoney(props.user.username, selectedAmount);

    if(status === 200) {
      sendSwal(`Money added successfully! Amount: ${selectedAmount}`, 'success');
      root.render(<Lobby user={updatedUser} socket={props.socket} />);
    }
    else {
      sendSwal('Couldnt add money', 'error');
      root.render(<Lobby user={props.user} socket={props.socket} />);
    }
  } else {
    sendSwal('Please select an amount.', 'error');
  }
  };

  return (
    <>
      <div className="upper-bg">
      <button className='exit-button' onClick={ClickBack}>Back</button>
      </div>
      <div className="background d-flex justify-content-center align-items-center">
        <div className="form-container form-container-extention p-4 rounded">
        <header className="reg-head text-center mb-4">This is your current amount of money: {props.user.moneyAmount}</header>
          <header className="reg-head text-center mb-4">Add Money</header>
          <div className="form-group">
            <label htmlFor="moneyAmount" className="form-label">
              Amount:
            </label>
            <select className="form-control" id="moneyAmount" ref={moneyAmountRef}>
              <option value="">Select Amount</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
            </select>
          </div>
          <button className="add-money" onClick={handleAddMoney}>
            Add Money
          </button>
        </div>
      </div>
    </>
  );
}

export default Add_Money_Page;
