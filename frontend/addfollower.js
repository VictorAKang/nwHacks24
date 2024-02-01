// url = "http://localhost:3000/addFollowerToQuestion";

// function follow() {
//   // form is the form of adding a new question
//   const form = document.getElementById( 'questionForm' );
//   const inputs = new FormData( form );

//   if (inputs.get( 'name' ) == ""){
//     alert("Please enter a name.");
//     return;
//   }


//   if (inputs.get( 'sid' ) == ""){
//     alert("Please enter a valid student number.");
//     return;
//   }

//   const studentId = parseInt(inputs.get( 'sid' ) );
//   if (isNaN(studentId)) {
//       alert("Invalid student ID. Please enter a valid number.");
//       return;
//   }

//   var qsid = localStorage.getItem("qsid");
  
//   var listOfSID = localStorage.getItem("sid");
//   if (listOfSID === null) {
//     localStorage.setItem("sid", JSON.stringify([inputs.get('sid')]));
//   } else {
//     listOfSID = JSON.parse(listOfSID);
//     listOfSID.push(inputs.get('sid'));
//     listOfSID =  [...new Set(listOfSID)];
//     localStorage.setItem("sid", JSON.stringify(listOfSID));
//   }

//   var obj =  {
//     "sname": inputs.get( 'name' ),
//     "ssid": inputs.get( 'sid'),
//     "qsid": qsid
//   };
  
//   console.log( "sending POST follower request with the following data:" );
//   console.log( obj );
//   var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
//   xmlhttp.onreadystatechange = function() {
//     if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
//         alert( "Student is following!" );
//         window.location.href = 'queue.html';
//     }
//   }
//   xmlhttp.open( "POST", "http://localhost:3000/addFollowerToQuestion" );
//   xmlhttp.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
//   xmlhttp.send( JSON.stringify(obj) );
// }

// const formSubmitButton = document.getElementById( 'submitQuestion' );
// formSubmitButton.addEventListener( "click", follow );

//////////////////////////////////

function getE( data ) {
    var gsid = localStorage.getItem("qsid");
    for( var i=0; i < data.length; i++ ) {
        var json = data[ i ];
        if( Number(json.asker.sid) === Number(gsid) ) {
            return json;
        }
    }
}

function injectQueue( data ) {
    var entry = getE( data );

    var list = document.getElementById( "entry-container" );
    console.log(list)
    var hmtlStr = `<div class = "previewEntry"><div class = "info">` +
        `<p>${entry.asker.name}  |   ${entry.category}  | ${entry.followers.split("¥").length-1 } followers` +
        `</div>` +  
        `<div class = "previewQuestion">` +
            `Question: ${entry.question} ` +
        `</div>` +
    `</div> `;

    list.innerHTML = hmtlStr;
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
    xmlHttp.open("GET", "http://localhost:3000/getQueue", true); // true for asynchronous 
    xmlHttp.send(null);
}

httpGetAsync(()=>{return});

function yesf() {
    var qsid = localStorage.getItem("qsid");

    var listOfSID = localStorage.getItem("sid");
    if (listOfSID === null) {
        localStorage.setItem("sid", JSON.stringify([qsid]));
    } else {
        listOfSID = JSON.parse(listOfSID);
        listOfSID.push(qsid);
        listOfSID =  [...new Set(listOfSID)];
        localStorage.setItem("sid", JSON.stringify(listOfSID));
    }

    var obj =  {
        "sname": "a",
        "ssid": 123,
        "qsid": qsid
    };

    console.log( "sending POST follower request with the following data:" );
    console.log( obj );
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
            alert( "Student is following!" );
            window.location.href = 'queue.html';
        }
    }
    xmlhttp.open( "POST", "http://localhost:3000/addFollowerToQuestion" );
    xmlhttp.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
    xmlhttp.send( JSON.stringify(obj) );
}

function nof() {
    window.location.href = 'queue.html;'
}

const yes = document.getElementById( 'yes' );
yes.addEventListener( "click", yesf );
const no = document.getElementById( 'no' );
no.addEventListener( "click", nof );