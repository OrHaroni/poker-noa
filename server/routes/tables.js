const express = require('express');
const router = express.Router();
const tableControllers = require('../controllers/tables.js');

//Get all tables
router.route('/').get(tableControllers.getAllTables);

//Validate a table that a user wants to go into
router.route('/validateTable').post(tableControllers.validateTable);

//join into a table after setting the money
router.route('/joinUserIntoTable').post(tableControllers.joinUserIntoTable);

//try to register a user
router.route('/addTable').post(tableControllers.addTable);

// route for leave table
router.route('/leaveTable').post(tableControllers.leaveTable);
// route for get players on table
router.route('/getPlayersOnTable/:tableName').get(tableControllers.getPlayersOnTable);



module.exports = router;