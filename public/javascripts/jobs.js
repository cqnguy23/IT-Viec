let page = 1;

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
        console.log({jobs})
        let jobHTML = jobs.map(renderJobs);
        document.getElementById("content").innerHTML = jobHTML.join("");
    }
  
}

function renderJobs(job) {
    return `
        <div onmouseover="this.style.backgroundColor='beige';" onmouseout="this.style.backgroundColor='';" style="display: flex; flex-direction: column; align-items: center; width: 90vh; border: 1px solid black">
            <h4 style= "width: 480px; margin-top: 20px; font-size: 20px; margin-bottom: 0"> ${job.title} - ${job.city} </h4>
            <!-- <img src="" width=480px height=240px">   -->
           <div style="display: flex; justify-content: space-between; width:480px;" >
                <h5> Up to ${job.salaryHigh}$ </h4>
                <h6 class = "mb-0"> Years of Experience Expected :${job.yrsXPExpected}  </h6>
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