//Loader animation code
// window.addEventListener("load", () => {
//   const loader = document.querySelector(".loader");

//   //loader without delay
//   //loader.classList.add("loader-hidden");
//   setTimeout(() => loader.classList.add("loader-hidden"), 1000);

//   loader.addEventListener("transitionend", () => {
//     document.body.removeChild("loader");
//   });
// })


// accordion for now serving entry
// const accordion0 = document.getElementsByClassName('entryServed');

// for (i = 0; i < accordion0.length; i++){
//   accordion0[i].addEventListener('click',  function(){
//     this.classList.toggle('active');
//   })
// }


// accordion for other entry
// const accordion1 = document.getElementsByClassName('entry');

// for (i = 0; i < accordion1.length; i++){
//   accordion1[i].addEventListener('click', function(){
//     this.classList.toggle('active');
//   })
// }


// const trash = document.getElementsByClassName('trash');
// for (i = 0; i < trash.length; i++){
//     trash[i].addEventListener('click', function(){
//     alert("Noodles gone RIP");
//       // TODO: replace this with deleting the entry
//   })
// }

// const follow = document.getElementsByClassName('follow');
// for (i = 0; i < follow.length; i++){
//       follow[i].addEventListener('click', function(){
//     alert("Following energy drinks");
//          window.location.href = 'addfollower.html';
//       // TODO: replace this with adding followers to the question
//   })
// }

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
  // console.log(JSON.parse(qString).q)
  qString = JSON.parse( qString ).q;
  if( qString == "" || qString == undefined) return "";
  const entries = qString.split('€');

  const jsonEntries = entries.map(entry => {
      return JSON.parse( entry );
  });
  return jsonEntries;
}

function setFollowButton( sid ) {
  localStorage.setItem("qsid", sid );
  window.location.href = 'followquestion.html';
}

function parseJSONToHTMLEntry( json, entryType, sid ) {
  var elem = `<div class = ${entryType}>` +
    `<div class = "info">` +
      `<p> ${ json.asker.name }  |   ${ json.category } | ${json.followers.split("¥").length-1 } followers` +
      `<span class="plus">` +
      // `<span class="trash fa fa-trash" onClick="setTrashButton( ${JSON.stringify(json)} )"></span>` +
      `<span id=${json.asker.sid} class="trash fa fa-trash" onClick="setTrashButton( this.id )"></span>` +
      // `<span id="trash" class="trash fa fa-trash"></span>` +
      // `<span id="${JSON.stringify(json)}" class="follow fa fa-user-plus" onClick="setFollowButton( this.id )"></span>` +
      `<span id="${json.asker.sid}" class="follow fa fa-user-plus" onClick="setFollowButton( this.id )"></span>` +
      `+</span>` +
      `</p>` + 
    `</div>` +
      `<div class = "question">` + 
          `Question: ${ json.question }` +
      `</div>` + 
    `</div>`;

  return elem;
}

function setAccordian( className ) {
  const accordion1 = document.getElementsByClassName( className );

  for (i = 0; i < accordion1.length; i++){
    accordion1[i].addEventListener('click', function(){
      this.classList.toggle('active');
    })
  }
}

function setTrashButton( sid ) {
  // alert( sid )
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  xmlhttp.onreadystatechange = function() { 
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
      httpGetAsync( () => {return});
      // alert( `Question ${sid} Successfuly deleted!`)
    }
  };
  xmlhttp.open("POST", "http://localhost:3000/removeQuestionBySID");
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send( JSON.stringify( { "sid":sid } ) );
}

// function setButton( data ) {
//   const trash = document.getElementsByClassName('trash');
//   for (i = 0; i < data.length; i++){
//     // trash[i].addEventListener('click', setTrashButton( data[ i ].asker.sid ) );
//     trash[i].addEventListener('click', function ()  {
//       // setTrashButton( 5);
//       setTrashButton( data[ i ].asker.sid );
//     } );
//     console.log( `attaching ${i} to sid ${data[i].asker.sid}`)
//   }
// }

function injectQueue( data ) {
  var list = document.getElementById( 'list' );
  if( data == "" ) { list.innerHTML=""; return;}
  var hmtlStr = `<div class = "entry-container">`;

  for( var i = 0; i < data.length; i++ ) {
    if( i == 0 ) var entryType = "entryServed";
    else var entryType = "entry";
    hmtlStr += parseJSONToHTMLEntry( data[ i ], entryType );
  }
  hmtlStr += `<\div>`;

  list.innerHTML = hmtlStr;
  // setButton( data );

  setAccordian( "entry" );
  setAccordian( "entryServed" );
}

function httpGetAsync( callback )
{ 
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        // console.log( xmlHttp.responseText)
        var out = parseQueueToJSON(xmlHttp.responseText);
        console.log( out );
        injectQueue( out );
        callback();
      }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

httpGetAsync( () => {return});
// function update() {
//   setTimeout( () => {
//     console.log( "updating ..." );
//     httpGetAsync( () => update() );
//   }, 5000);
// }

// update()