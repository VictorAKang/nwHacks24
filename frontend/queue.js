//Loader animation code
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  //loader without delay
  //loader.classList.add("loader-hidden");
  setTimeout(() => loader.classList.add("loader-hidden"), 1000);

  loader.addEventListener("transitionend", () => {
    document.body.removeChild("loader");
  });
})





// accordion for now serving entry
const accordion0 = document.getElementsByClassName('entryServed');

for (i = 0; i < accordion0.length; i++){
  accordion0[i].addEventListener('click', function(){
    this.classList.toggle('active');
  })
}


// accordion for other entry
const accordion1 = document.getElementsByClassName('entry');

for (i = 0; i < accordion1.length; i++){
  accordion1[i].addEventListener('click', function(){
    this.classList.toggle('active');
  })
}

url = "http://localhost:3000/getQueue"

function parsePersonToJSON(personString) {
    const personValues = personString.split(',');

    const jsonPerson = {
        name: personValues[0].trim(),
        sid: personValues[1].trim(),
    };
    return jsonPerson;
}

function parseEntryToJSON(entryString) {
    console.log( entryString );

    const entryValues = entryString.split(',');

    const jsonEntry = {
        readyToTalk: entryValues[0].trim(),
        asker: parsePersonToJSON(entryValues.slice(1, 2).join(',')),
        question: entryValues[2].trim(),
        category: entryValues[3].trim(),
        followers: entryValues[4].trim(),
    };
    return jsonEntry;
}

function parseQueueToJSON( qString ) {
    const entries = qString.split(',');

    const jsonEntries = entries.map(entry => {
        return JSON.parse( entry );
    });
    return jsonEntries;
}

function httpGetAsync()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // console.log(xmlHttp.responseText);
            var test = parseQueueToJSON(xmlHttp.responseText);
            console.log( test );
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}
httpGetAsync()