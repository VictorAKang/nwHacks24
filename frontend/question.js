url = "http://localhost:3000/addEntry";

function getEntry() {
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

  if (inputs.get( 'question' ) == ""){
    alert("Please enter a valid question.");
    return;
  }

  var obj =  {
    "name": inputs.get( 'name' ),
    "sid": inputs.get( 'sid'),
    "question": inputs.get( 'question' ),
    "category": inputs.get( 'category')
  };
  
  console.log( "sending POST request with the following data:" );
  console.log( obj );
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
      alert( "Question added to Queue!" );
      window.location.href = 'queue.html';
    }
  }
  xmlhttp.open( "POST", url );
  xmlhttp.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
  xmlhttp.send( JSON.stringify( obj ) );

  var listOfSID = localStorage.getItem("sid");
  if (listOfSID === null) {
    localStorage.setItem("sid", JSON.stringify([inputs.get('sid')]));
  } else {
    listOfSID = JSON.parse(listOfSID);
    listOfSID.push(inputs.get('sid'));
    listOfSID =  [...new Set(listOfSID)];
    localStorage.setItem("sid", JSON.stringify(listOfSID));
  }
  
}

const formSubmitButton = document.getElementById( 'submitQuestion' );
formSubmitButton.addEventListener( "submit", getEntry);