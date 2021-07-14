//CRUD Job
const express = require('express');
const router = express.Router();
let { companies } = require('../data/jobs.json')
let { jobs } = require('../data/jobs.json')
let { ratings } = require('../data/jobs.json')
let company = companies[0]
//Create
const admissableFooParams = companies.keys();
router.post('/', (req, res) => {
    const company = {}
    for (const param of admissableFooParams) {
        if (req.body[param]) company[param] = req.body[param];
    }
    companies.push(company);
    res.send(company);
})
router.patch("/:id", (req, res) => {

    companies = companies.map((company) => {
        if (company.id == req.params.id) {
            company.enterprise = true;
        }
        return company;
    })



    res.send(companies);
})
/* Function to find  */

router.get('/', (req, res) => {

    let { page = 1, name, title, city, skills, cities, sortBy } = req.query

    let temp = [];
    if (name) {
        let varCompanies = companies.filter(company => {
            return company.name == name
        })
        temp.push(varCompanies);
    }

    if (title) {


        let filteredCompany = jobs.filter(job => job.title.includes(title) || job.title.includes(title.toLowerCase))
        let filteredCompanyID = filteredCompany.map((company) => company.companyId)
        let varCompanies = companies.filter(company => {
            let result = false;
            filteredCompanyID.forEach((id) => {
                if (company.id == id) {
                    result = true;
                }
            })
            return result;
        })
        temp.push(varCompanies);
    }

    if (city) {
        let filteredCompany = jobs.filter(job => job.city.includes(city) || job.city.includes(city.toLowerCase))
        let filteredCompanyID = filteredCompany.map((company) => company.companyId)
        let varCompanies = companies.filter(company => {
            let result = false;
            filteredCompanyID.forEach((id) => {
                if (company.id == id) {
                    result = true;
                }
            })
            return result;
        })
        temp.push(varCompanies);

    }
    else if (cities) {
        let firstCity = cities.split(',')[0];
        let secondCity = cities.split(',')[1];
        let filteredCompany = jobs.filter(job => job.city.includes(firstCity) || job.city.includes(firstCity.toLowerCase) || job.city.includes(secondCity) || job.city.includes(secondCity.toLowerCase))
        let filteredCompanyID = filteredCompany.map((company) => company.companyId)
        let varCompanies = companies.filter(company => {
            let result = false;
            filteredCompanyID.forEach((id) => {
                if (company.id == id) {
                    result = true;
                }
            })
            return result;
        })
        temp.push(varCompanies);
    }


    if (skills) {
        let varCompanies = companies.filter(company => { //search if skill includes part of param
            let result = false;
            company.skills.forEach((skill) => {
                if (skill.includes(skills)) result = true;
                return result;
            })
            return result;
        })
        temp.push(varCompanies);

    }
    /*  
        1. create new ids array with key avg added
        2. for each company, map through the ratings id and return the avg value . Calculate the avg value for that company and add an avg key
        3. sort the company using the avg value key
        */
    if (sortBy == "ratings") { 
        let processedRating = ratings.map((rating) => { //1. create new ids array with key avg added
            const { workLifeBalanceRatings,
                payAndBenefits,
                jobsSecurityAndAdvancement,
                management,
                culture } = rating;
            let avg = (workLifeBalanceRatings + payAndBenefits + jobsSecurityAndAdvancement + management + culture)/5; 
            return {
                id: rating.id,
                avgScore: avg
            }
        })
        let dummyCompanies = companies
        dummyCompanies.forEach((company) => {
            let sum = 0;
            company.ratings.forEach((id) => {
                processedRating.forEach((rating) => {
                    if (id == rating.id) {
        // 2. for each company, map through the ratings id and sum the avg value .
                        sum += rating.avgScore; 
                    }
                })
            })
            
            company.avgRating = sum/(company.ratings.length); // Calculate the avg value key for that company and add an avg key
            console.log(company.avgRating)

        })
       
        dummyCompanies.sort((a, b) => b.avgRating - a.avgRating) // 3. sort the company using the avg value key
        console.log({dummyCompanies}) //test to see if function is correct
        // dummyCompanies.forEach((company) => { delete company["avgRating"]; }) //add this if want to delete avgRating key
        temp.push(dummyCompanies)
    }

    /* Pagination for Categories */
    if (page && !name && !title && !city && !skills && !sortBy) {
        temp = companies.slice((page - 1) * 20, (page - 1) * 20 + 20);
    }
   /*  else if (sortBy) {
        temp = temp[0][0].slice((page - 1) * 20, (page - 1) * 20 + 20);
    } */
    else {
        temp = temp[0].slice((page - 1) * 20, (page - 1) * 20 + 20);

    }
    
    res.send(temp);
})

router.delete("/:id", (req, res) => {
    companies = companies.reduce((result, company) => {
        if (company.id != req.params.id) {
            result.push(company);
        }
        return result;
    }, [])

    res.send(companies);
})

module.exports = router;