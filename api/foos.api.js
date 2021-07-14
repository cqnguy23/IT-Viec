//CRUD Foo
const express = require('express');
const router = express.Router();
let {foos} = require('../data/foos.json')

//Create

const admissableFooParams = ['fistName','lastName'];

router.post('/', (req, res) => {
    const foo = {}
    for (const param of admissableFooParams) {
        if(req.body[param]) foo[param] = req.body[param];
    }
    foo.fullName = req.body.firstName + req.body.lastName;
    foos.push(foo);
    res.send(foo);  
})

router.get('/', (req, res) => {
    res.send("Hello");
})

module.exports = router;