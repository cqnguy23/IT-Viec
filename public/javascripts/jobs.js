
let page = 1;

/* Form Config */
// let data = { name: "Alo" };

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

console.log(makeid(5));

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
    await postData("http://localhost:5000/jobs", job);
    getJobs();

})





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
    let url = getUrl() + "/" + id;
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



function getUrl() {
    let url = "http://localhost:5000/jobs";

    /* const urlExtension = window.location.search.split("?")[1];
        if (!urlExtension) {url += "&country=us"}    
        else {
            url += "&" + urlExtension;
        } */
    return url;
}
let jobs = []
async function getJobs() {
    try {
        let urlToGet = getUrl() + `?page=${page}`
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
    } catch (error) {
        console.log(error);
        jobs = JSON.parse(localStorage.getItem("willWork"));
    }
    finally {
        console.log({ jobs })
        let jobHTML = jobs.map(renderJobs);
        document.getElementById("content").innerHTML = jobHTML.join("");
    }

}

function renderJobs(job) {
    let milisec = Date.parse(job.postedDate)
    let a = new Date(milisec)
    let postedDate = a.toDateString();
    let id = job.id;
    return `
        <div class="col">
          <div class="card shadow-sm">
            <span class="close" onclick="deleteJob('${id}')" id="closeButton" style="align-self: flex-end">&times;</span>
          
            <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
            <rect width="100%" height="100%" fill="#55595c"/>
            
            <text font-weight="bold" font-size="15px" x="5%" y="50%" fill="#eceeef" >${job.title} - ${job.city}</text>
            
            </svg>
            <div class="card-body">
              <h6> Up to ${job.salaryHigh}$ </h4>
              <h6> Years of Experience Expected :${job.yrsXPExpected}  </h6>
              <h6> Date Posted :${postedDate}  </h6>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                  <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                </div>
                <small class="text-muted">9 mins</small>
              </div>
            </div>
          </div>
        </div>
    `
}

function renderNextPage() {
    ++page;
    getJobs();
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