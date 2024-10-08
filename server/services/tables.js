const tableSchema = require('../models/tables.js')
const userSchema = require('../models/users.js')

const MAX_PLAYERS_IN_TBL = 5;

// Function to retrieve all users
async function getAllTables() {
    try {
      const tables = await tableSchema.find({});
      return tables;
    } catch (error) {
      console.error('Error retrieving tables:', error);
      throw error;
    }
  }

  // get players on table based on the table name
  async function getPlayersOnTable(tableName) {
    try {
      const table = await tableSchema.findOne({ "name": tableName });
      return table.playersOnTable;
    } catch (error) {
      console.error('Error retrieving players on table:', error);
      throw error;
    }
  }

/* Validation on the table name before adding */
const isTableNameTaken = async (name) => {
    try {
        const table = await tableSchema.findOne({ "name": name });
        return (table !== null); // If user is found, email is taken
      } catch (error) {
        console.error('Error checking name availability:', error);
        throw error;
      }
}

/* Validation exsist table before joining */
const validateTable = async (tableName, password, username) => {
    try {
      // finding the table by the name and password, and adding the username to the spectators list 
      let table = await tableSchema.findOne({ "name": tableName, "password": password });
      return table;
      } catch (error) {
        console.error('Error validation table:', error);
        throw error;
      }
}

/* Joining table */
const joinUserIntoTable = async (tableName, username, moneyToEnterWith) => {
  try {
    const table = await tableSchema.findOne({"name": tableName});//No need for password because already validated.

    if(table.numOfPlayers === MAX_PLAYERS_IN_TBL) {
      return 2; //table is full;
    }

    const user = await userSchema.findOne({"username": username });

    if(user) {
      if(user.moneyAmount < moneyToEnterWith) {
        return 1; //no enough money.
      }
      else {
        // limit the user to enter with 2 times the big blind
        if(moneyToEnterWith < 2*table.bigBlind) {
          return 3; //not enough money to play
        }
        //Decrease the money for this user
        user.moneyAmount -= moneyToEnterWith;
        await user.save();
        //create minimal parameters user
        // remove the user from the spectators 
        return 0;//0 for no money problem.
      }
    }
  } catch(error){
        console.error('Error joining into table:', error);
        throw error;
  }

}

/* Adding new table */
const addTable = async (table, userCreated) => {
    const name = table.name;

    try{

    if(await isTableNameTaken(name)) {
        return 2; //table name is taken 
    }

    //Now we know its valid
    table.players_num = 0;
    table.moneyAmountOnTable = 0;
    table.bigBlind = 100;
    table.smallBlind = 50;
    table.cardOnTable = [];
    table.playersOnTable = [];
    table.createdBy = userCreated;

    const newTable = new tableSchema(table);
    await newTable.save();
    } catch(error) {
        console.error('Error adding table in servies:', error);
        throw error;
    }
    return 0; //everything good
}

/* Exiting table */
const leaveTable = async (tableName, nickname) => {
    try {
      
        // Update the table by pulling the player with the given nickname from the array
        await tableSchema.updateOne(
          { name: tableName },
          { $pull: { playersOnTable: { nickname: nickname } } }
        );

        return 0 ;
      } catch (error) {
        console.error('Error leaving table:', error);
        throw error;
      }
}


module.exports = {
    getAllTables, validateTable, addTable, leaveTable, joinUserIntoTable ,getPlayersOnTable
  }