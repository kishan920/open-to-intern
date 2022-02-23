const express = require('express');
const router = express.Router();
const collegeController = require("../controllers/collegeController")
const internController = require("../controllers/internController.js")


// API FOR COLLEGE CREATION
router.post('/functionUp/Colleges', collegeController.collegeCreate);

// API FOR INTERN CREATION
router.post('/functionup/interns', internController.internCreate);

// API FOR GET INTERNS DETAILS WITH COLLEGE NAME
router.get('/functionup/collegeDetails', collegeController.getAllIntern);


module.exports = router;