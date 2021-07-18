
async function saveJob(id) {
    let job = await postSavedJobs(getUrl("users"), id);
    console.log(job);
}

async function postSavedJobs(url, id) {
    let data = { "savedID": id }
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
            body: JSON.stringify(data)
            , // body data type must match "Content-Type" header
        });
        result = await response.json()
        return result; // parses JSON response into native JavaScript objects
    }
    catch (err) {
        console.log(err);
    }
}

async function getSavedJobs() {
    let savedJobs = [];
    try {
        let urlToGet = getUrl("users")
        /* if (queryPresent) {
            urlToGet += q ;
        } */
        console.log(urlToGet)
        let response = await fetch(urlToGet);
        const {user} = await response.json();
        
        let jobIDs = user.savedJobs

        savedJobs = await Promise.all(jobIDs.map(async jobID => await getJobsFromID(jobID)))
        savedJobs = await Promise.all(savedJobs.map( async (job) =>  {
            return { ...job, companyName: await getCompanyName(job.companyId)}
        }))
        console.log({savedJobs})
    } catch (error) {
        console.log(error);
    }
    finally { 
        let jobHTML = savedJobs.map(renderSavedJob);
        document.getElementById("savedJobs-content").innerHTML = jobHTML.join("");
    }

}

async function getJobsFromID(id) {
    let jobs;
    try {
        let urlToGet = getUrl("jobs") + `?id=${id}`
        /* if (queryPresent) {
            urlToGet += q ;
        } */
        let response = await fetch(urlToGet);
        jobs = await response.json();
        
    } catch (error) {
        console.log(error);
        jobs = JSON.parse(localStorage.getItem("willWork"));
    }
    finally { 
        return jobs[0]
    }
}
function renderSavedJob(job) {
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
          <div class="d-flex justify-content-end align-items-center">
          
          </div>
      </div>
    </div>
  </div>
    `
}

//render modal savedjobs form 
// Get the modal
let jobsModal = document.getElementById("savedJobs");

// Get the button that opens the modal
let jobsBtn = document.getElementById("saveButton");

// Get the <span> element that closes the modal
let jobSpan = document.getElementsByClassName("close")[1];
// When the user clicks on the button, open the modal
jobsBtn.onclick = function () {
    jobsModal.style.display = "block";
console.log(jobSpan.onclick)

}
// When the user clicks on <jobSpan> (x), close the jobsModal
jobSpan.onclick = () => {
console.log(jobSpan.onclick);
    jobsModal.style.display = "none";
}

// When the user clicks anywhere outside of the jobsModal, close it
window.onclick = function (event) {
    if (event.target == jobsModal) {
        jobsModal.style.display = "none";
    }
}


