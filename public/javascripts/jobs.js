
let page = 1;

/* Form Config */
// let data = { name: "Alo" };

async function createJob(data) {
    let url = "http://localhost:5000/jobs";
    let res = await fetch(url, { method: "POST", body: data })
    console.log(res);
    let a = await res.json();
    console.log(a)
}
// createJob();
let form = document.getElementById('newjob');


form.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log({ form })
    let id = form.elements['id'].value
    let title = form.elements['title'].value
    let city = form.elements['city'].value
    let salary = form.elements['salary'].value
    let expyears = form.elements['expyears'].value

    let job = { "id": id, "city": city, "salary": salary, "expyears": expyears, "title": title }
    postData("http://localhost:5000/jobs", job);
    getJobs();
    location.reload();

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
        document.getElementById("title").innerHTML = `<h1 style="text-align: center; color:blue; margin-top: 15px"> ITViec </h1>`;

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
    return `
        <div onmouseover="this.style.backgroundColor='beige';" onmouseout="this.style.backgroundColor='';" style="display: flex; flex-direction: column; align-items: center; width: 90vh; border: 1px solid black">
            <h4 style= "width: 480px; margin-top: 20px; font-size: 20px; margin-bottom: 0"> ${job.title} - ${job.city} </h4>
            <!-- <img src="" width=480px height=240px">   -->
           <div style="display: flex; justify-content: space-between; width:480px;" >
                <h5> Up to ${job.salaryHigh}$ </h4>
                <div>
                <h6 class = "mb-0"> Years of Experience Expected :${job.yrsXPExpected}  </h6>
                <h6 class = "mb-0"> Date Posted :${postedDate}  </h6>
                </div>
            </div>
            <p style="width:480px "> ${job.description} </p>
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