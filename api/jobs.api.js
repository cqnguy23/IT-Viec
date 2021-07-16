//CRUD Job
const express = require('express');
const router = express.Router();
let {jobs} = require('../data/jobs.json')
let { companies } = require('../data/jobs.json')

//Create

const admissableFooParams = Object.keys(jobs[0]);
router.post('/', (req, res) => {
    const job = {}
    for (const param of admissableFooParams) {
        console.log(req.body)
        if(req.body[param]) job[param] = req.body[param];
    }
    jobs.unshift(job);
    res.send({job});  
})

router.patch("/:id", (req, res) => {

    jobs = jobs.map((job) => {
        if (job.id == req.params.id) {
            job.taken = true;
        }
        return job;
    })

    console.log(jobs)


    res.send(jobs);
})

router.get('/', (req, res) => {
    let { page = 1, companyName, title, city, skills, q } = req.query

    let temp = [];
    if (companyName) {
        let varJobs = jobs.filter(job => {
            return findCompanyNames(job.id, companyName)
        })
        temp.push(varJobs);
    }

    if (title) {
        let varJobs = jobs.filter(job => job.title.includes(title) || job.title.includes(title.toLowerCase))
        temp.push(varJobs);
    }

    if (city) {
        let varJobs = jobs.filter(job => job.city.includes(city) || job.title.includes(city.toLowerCase))
        temp.push(varJobs);
    }

    if (skills) {
        let varJobs = jobs.filter(job => { //search if skill includes part of param
            let result = false;
            job.skills.forEach((skill) => {
                if (skill.includes(skills)) result = true;
                return result;
            })
            return result;
        })
        temp.push(varJobs);
    }
    console.log(q)
    if (q) {
        let varJobs = jobs.filter(job => job.title.toLowerCase().includes(q.toLowerCase()))
        temp.push(varJobs)
    }
    /* Pagination for Categories */
 
    if (page && !companyName && !title && !city && !skills && !q) {
        temp = jobs.slice((page - 1) * 21, (page - 1) * 21 + 21);
    }
    else {
        temp = temp[0].slice((page - 1) * 21, (page - 1) * 21 + 21);
    }
    res.send(temp);
})

router.delete("/:id", (req, res) => {
    jobs = jobs.filter(job => job.id != req.params.id)
    console.log(jobs);
    res.send(jobs); 
})

module.exports = router;