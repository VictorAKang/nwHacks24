// url = "http://localhost:3000/addFollowerToQuestion";

function follow() {
  // form is the form of adding a new question
  const form = document.getElementById( 'questionForm' );
  const inputs = new FormData( form );

  if (inputs.get( 'name' ) == ""){
    alert("Please enter a name.");
    return;
  }


  if (inputs.get( 'sid' ) == ""){
    alert("Please enter a valid student number.");
    return;
  }

  const studentId = parseInt(inputs.get( 'sid' ) );
  if (isNaN(studentId)) {
      alert("Invalid student ID. Please enter a valid number.");
      return;
  }

  var qsid = localStorage.getItem("qsid");
  
  var listOfSID = localStorage.getItem("sid");
  if (listOfSID === null) {
    localStorage.setItem("sid", JSON.stringify([inputs.get('sid')]));
  } else {
    listOfSID = JSON.parse(listOfSID);
    listOfSID.push(inputs.get('sid'));
    listOfSID =  [...new Set(listOfSID)];
    localStorage.setItem("sid", JSON.stringify(listOfSID));
  }

  var obj =  {
    "sname": inputs.get( 'name' ),
    "ssid": inputs.get( 'sid'),
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

const formSubmitButton = document.getElementById( 'submitQuestion' );
formSubmitButton.addEventListener( "click", follow );