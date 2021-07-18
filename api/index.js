const express = require('express');
const router = express.Router();


//CRUD MY FOOS
const foosApi = require('./foos.api')
router.use("/foos", foosApi)


const jobsApi = require('./jobs.api')
router.use("/jobs", jobsApi)

const companiesApi = require('./companies.api')
router.use("/companies", companiesApi)

const usersApi = require('./users.api')
router.use("/users", usersApi)

module.exports = router;