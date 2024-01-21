url = "https://localhost:3000/addEntry";

function getEntry() {
  // form is the form of adding a new question
  const form = document.getElementById( 'questionForm' );
  const inputs = new FormData( form );

  // for (const [key, value] of inputs) {
  //   console.log(`${key}: ${value}\n`);
  // }
  // console.log( inputs.get('sid'))
  // inputs[ 0 ] - name
  // inputs[ 1 ] - student id
  // inputs[ 2 ] - question
  // inputs[ 3 ] - category, deprecated for now
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
  
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  // xmlHttp.onreadystatechange = function() {
  //   alert( "Question added to Queue!" );
  //   window.location.href = 'queue.html';
  // }
  xmlhttp.open( "POST", url );
  xmlhttp.setRequestHeader( "Content-Type", "application/json;charset=UTF-8" );
  xmlhttp.send( JSON.stringify( obj ) );

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          console.log(xmlHttp.responseText);
  }
  xmlHttp.open("GET", "0.0.0.0:3000/", true); // true for asynchronous 
  xmlHttp.send(null);
}

const formSubmitButton = document.getElementById( 'submitQuestion' );
// formSubmitButton.addEventListener( 'submit', getEntry );
if (formSubmitButton) {
  formSubmitButton.addEventListener( "click", getEntry);
}



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
