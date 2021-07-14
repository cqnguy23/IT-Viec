//CRUD Job
const express = require('express');
const router = express.Router();
let {jobs} = require('../data/jobs.json')
let job = jobs[0];
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
    let { page = 1, companyName, title, city, skills } = req.query

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
        console.log(jobs[0].skills)
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

    /* Pagination for Categories */
    if (page && !companyName && !title && !city && !skills) {
        temp = jobs.slice((page - 1) * 20, (page - 1) * 20 + 20);
    }
    else {
        temp = temp[0].slice((page - 1) * 20, (page - 1) * 20 + 20);
    }

    res.send(temp);
})

router.delete("/:id", (req, res) => {
    jobs = jobs.reduce((result, job) => {       
        if (job.id != req.params.id) {
            result.push(job);
        }
        return result;
    }, [])

    console.log(jobs);
    res.send(jobs); 
})

module.exports = router;