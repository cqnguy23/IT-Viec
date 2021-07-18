var express = require('express');
var router = express.Router();
let user = {
  "fistName": "Chuong",
  "lastName": "Nguyen",
  "savedJobs": []
}
/* GET users listing. */

router.post('/', function (req, res, next) {
  console.log(req.body);
  let jobID = req.body["savedID"];

  if (!user.savedJobs.includes(jobID)) { //check for duplicate
    user.savedJobs.push(jobID);
  }
  res.send({ user });

});
router.get('/', function (req, res, next) {
  res.send({ user });
});

module.exports = router;

