//Note for anyone viewing, add the following before your get request to avoid the CORS issue
//https://cors-anywhere.herokuapp.com/

//API Documentation: https://api-docs.igdb.com/#about

/*
Syntax for SAVING data to localStorage:

localStorage.setItem("key", "value");
Syntax for READING data from localStorage:

var lastname = localStorage.getItem("key");
Syntax for REMOVING data from localStorage:

localStorage.removeItem("key");
*/

const API_KEY = "ea8883099be2c2944a4d34a9752d94f0";

let $posters = $(`#gamePosters`);

let editNav = function () {
    let jwt = localStorage.getItem("jwt");
    let component;
    if (jwt == null) {
        component = $(`
            <li><a href="accLogin.html">Login</a></li>
        `);
    } else {
        component = $(`
            <li><a href="profilePage.html">Profile</a></li>
            <li><a id="log_out" href="index.html">Log out</a></li>
        `);
    }
    $('#nav').append(component);
}

let handleLogOut = function () {
    localStorage.removeItem("jwt");
}

let start = async function () {
    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },

        data: `fields name,popularity, rating,cover,first_release_date; where rating > 90  ;limit 20; sort popularity desc; `
    })

    for (let i = 0; i < result.data.length; i++) {
        addCover(result.data[i].cover, result.data[i].id)

    }
    addNews();
}
//& first_release_date >1546300800 
let addCover = async function (cover, id) {

    let result = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/covers",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: `fields url, height, width, image_id; where id=${cover};`
    })
    // Clickable posters
    $('#gamePosters').prepend(`<img src="//images.igdb.com/igdb/image/upload/t_1080p/${result.data[0].image_id}.jpg" onclick="handlePosterClick(${id})" class="posters" id=${id}/></a>`)

    function handlePosterClick(gameid) {
        console.log("game id is " + gameid) + " after clicking";
        localStorage.setItem("id", gameid);
        window.location.href = "gamePage.html";
    }
}

let addNews = async function () {
    let pulses = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/pulses",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: "fields author,category,created_at,ignored,image,published_at,pulse_image,pulse_source,summary,tags,title,uid,updated_at,videos,website; where created_at > 1546300800; limit 30;"
    })




    for (let i = 0; i < pulses.data.length; i++) {
        if (pulses.data[i].summary !== undefined && pulses.data[i].website !== undefined) {
            let pulsesSource = await axios({
                url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/pulse_urls",
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'user-key': API_KEY
                },
                data: `fields trusted,url,id; where id =${pulses.data[i].website};`
            })


            if (pulses.data[i].image !== undefined) {
                // include image if there is one
                $('#news').append(`
                    <div id="posts" class="${pulses.data.id} reviewBox">
                        <h2 class="has-text-bold" id="author">${pulses.data[i].author}</h2>
                        <h3 id="ptitle">${pulses.data[i].title}</h3>
                        <a  href="${pulsesSource.data[0].url}"><img class="pimg" src="${pulses.data[i].image}"></a>
                        <p id="psum">${pulses.data[i].summary}</p>
                        <a style="color:blue;" href="${pulsesSource.data[0].url}">Read More</a>
                        
                    </div>`)
            } else {
                // don't include the image
                $('#news').append(`
                    <div id=posts class="${pulses.data.id} reviewBox">
                        <h2 class="has-text-bold"  id="author">${pulses.data[i].author}</h2>
                        <h3 id="ptitle">${pulses.data[i].title}</h3>
                        <p id="psum">${pulses.data[i].summary}</p>
                        <a style="color:blue;" href="${pulsesSource.data[0].url}">Read More</a>
                    </div>`)
            }

        }


    }

}

function autocomplete(inp, arr,id) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input id = '" + id + "'type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
  

  let searchOptions = async function() {
     
    let options = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: `fields name, id; sort popularity desc; limit 150;`,
    });
    let answer = [];
    let ids = [];

    for(let i = 0; i < 49; i++) {
        answer[i]= await options.data[i].name;
        ids[i] = await options.data[i].id;
    }

    autocomplete(document.getElementById("myInput"), answer);
  }

  let onSubmit = async function(event) {
    event.preventDefault();
    let title = document.getElementById("myInput").value;
    console.log(title);
    let options = await axios({
        url: "https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'user-key': API_KEY
        },
        data: `fields name, id; sort popularity desc; limit 150;`,
    });
    let gameid; 

    for(let i = 0; i < 149; i++) {
       let option1 = await options.data[i].name;
       if(option1 === title) {
           gameid = await options.data[i].id;
        }
    }
    localStorage.setItem("id", gameid);
    window.location.href = "gamePage.html";
  }


$(document).ready(function () {
    $(document).on('click', '#log_out', handleLogOut);
    editNav();
    searchOptions();
    $(document).on('click', '#submit', onSubmit );
    //start();
});