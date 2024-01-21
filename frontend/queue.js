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

    var followers = []

    entryValues[4].trim().split( '¥' ).foreach( entry=> {
      followers.push( parsePersonToJSON( entry ) );
    });

    const jsonEntry = {
        readyToTalk: entryValues[0].trim(),
        // asker: parsePersonToJSON(entryValues.slice(1, 2).join(',')),
        asker: entryValues[1].trim(),
        question: entryValues[2].trim(),
        category: entryValues[3].trim(),
        // followers: entryValues[4].trim(),
        followers: followers
    };
    return jsonEntry;
}

function parseQueueToJSON( qString ) {
    const entries = qString.split('€');

    const jsonEntries = entries.map(entry => {
        return JSON.parse( entry );
    });
    return jsonEntries;
}

function parseJSONToHTMLEntry( json ) {
  var elem = `<div class = "entry">` +
    `<div class = "info">` +
      `<p> ${ json.asker.name }  |   ${ json.category }` +
      `<span class="plus">+</span>` +
      `</p>` + 
    `</div>` +
      `<div class = "question">` + 
          `Question: ${ json.question }` +
      `</div>` + 
    `</div>` +
  `</div>`;

  return elem;
}

function injectQueue( data ) {
  var list = document.getElementById( 'list' )

  var queueStr = "";
  for( var i = 0; i < data.length; i++ ) {
    queueStr = queueStr.concat( '\n', parseJSONToHTMLEntry( data[ i ] ) );
  }
  // data.foreach( entry => {
  //   queueStr = queueStr.concat( '\n', parseJSONToHTMLEntry( entry ) );
  // });

  list.innerHTML = queueStr;
}

function httpGetAsync()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // console.log(xmlHttp.responseText);
            var out = parseQueueToJSON(xmlHttp.responseText);
            console.log( out );
            injectQueue( out );
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}
httpGetAsync()