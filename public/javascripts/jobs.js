
let page = 1;
let inSearchMode=false;
/* Form Config */
// let data = { name: "Alo" };
let jobs = []

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


// createJob();
let form = document.getElementById('newjob');


form.addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log({ form })
    let id = makeid(10);
    let title = form.elements['title'].value
    let city = form.elements['city'].value
    let salary = form.elements['salary'].value
    let expyears = form.elements['expyears'].value
    let postedDate = new Date()
    let job = { "id": id, "city": city, "salaryHigh": salary, "yrsXPExpected": expyears, "title": title, "postedDate": postedDate.toDateString() }
    console.log({ job })
    await postData(getUrl("jobs"), job);
    getJobs();

})
let query;
let searchBar = document.getElementById('searchBar')

searchBar.addEventListener('submit', async (event) => {
    event.preventDefault();
    inSearchMode = true;
    query = searchBar.elements['query'].value
    console.log({ query })

    await searchData(getUrl("jobs"), query)
    
})

async function searchData(url, query) {
    try {
        let urlToGet = url + "?q=" + query;
        console.log(urlToGet)
        let response = await fetch(urlToGet);
        const json = await response.json();
        if (page == 1) {
            jobs = json;
        }
        else {
            jobs = jobs.concat(json);
        }

        localStorage.setItem("willNotWork", jobs);

        localStorage.setItem("willWork", JSON.stringify(jobs));
        jobs = await Promise.all(jobs.map( async (job) =>  {
            return { ...job, companyName: await getCompanyName(job.companyId)}
        }))
        
    } catch (error) {
        console.log(error);
        jobs = JSON.parse(localStorage.getItem("willWork"));
    }
    finally { 
        let jobHTML = jobs.map(renderJobs);
        document.getElementById("content").innerHTML = jobHTML.join("");
    }

}


async function postData(url = '', data = {}) {
    console.log(url);
    let result;
    // Default options are marked with *
    try {
        let response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        console.log({ response })
        result = await response.json()
        return result; // parses JSON response into native JavaScript objects
    }
    catch (err) {
        console.log(err);
    }
}
async function deleteJob(id) {
    console.log("Here");
    let url = getUrl("jobs") + "/" + id;
    await deleteData(url);
    getJobs();
}
async function deleteData(url) {
    console.log();
    let result;
    // Default options are marked with *
    try {
        let response = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log({ response })
        result = await response.json()
        return result; // parses JSON response into native JavaScript objects
    }
    catch (err) {
        console.log(err);
    }

    
}



function getUrl(type) {

    let url = "http://localhost:5000/";
    if (type != "companies" && type != "jobs") {
        console.log("wrong input url")
    }

    url += type
    /* const urlExtension = window.location.search.split("?")[1];
        if (!urlExtension) {url += "&country=us"}    
        else {
            url += "&" + urlExtension;
        } */
    return url;
}
async function getJobs() {
    try {
        let urlToGet = getUrl("jobs") + `?page=${page}`
        /* if (queryPresent) {
            urlToGet += q ;
        } */
        console.log(urlToGet)
        let response = await fetch(urlToGet);
        const json = await response.json();
        if (page == 1) {
            jobs = json;
        }
        else {
            jobs = jobs.concat(json);
        }

        localStorage.setItem("willNotWork", jobs);

        localStorage.setItem("willWork", JSON.stringify(jobs));
        jobs = await Promise.all(jobs.map( async (job) =>  {
            return { ...job, companyName: await getCompanyName(job.companyId)}
        }))
        
    } catch (error) {
        console.log(error);
        jobs = JSON.parse(localStorage.getItem("willWork"));
    }
    finally { 
        let jobHTML = jobs.map(renderJobs);
        document.getElementById("content").innerHTML = jobHTML.join("");
    }

}

async function getCompanyName(id) {
    let name;
    let companies = [];
    try {
        const res = await fetch(getUrl("companies") + "?displayAll=true");
        companies = await res.json();
        name = await companies.find(company => company.id == id).name
    } catch (err) {
        console.log(err)
    }
 
    return name;
}

getCompanyName("_fdozh6xci");

function renderJobs(job) {
    let milisec = Date.parse(job.postedDate)
    let a = new Date(milisec)
    let postedDate = a.toDateString();
    let id = job.id;
    return `
    <div class="col">
    <div class="card shadow-sm card1" style="height: 45vh">

      <span style="position: absolute; right: 0;" class="close" onclick="deleteJob('${id}')" id="closeButton"
        style="align-self: flex-end">&times;</span>
      
        <div style = "margin: 40px 1rem 0 1rem">
          <h4    font-weight="bold" font-size="5px" fill="red">${job.title} <i>(${job.companyName})</i></h3>
        </div>
      
      <div class="card-body" style="margin-top: 20px;">
        
        <h6> Up to ${job.salaryHigh}$ </h4>
          <h6> Years of Experience Expected :${job.yrsXPExpected} </h6>
          <h6> Date Posted :${postedDate} </h6>
          <div class="d-flex justify-content-between align-items-center">
           
            <small class="text-muted">9 mins</small>
          </div>
      </div>
    </div>
  </div>
    `
}

function renderNextPage() {
    ++page;
    if (inSearchMode || query=="") {
        searchData(getUrl("jobs"), query)
    }
    else {
        getJobs();
    }
    
    console.log("Invoke")
}
getJobs();


//render modal form 
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}