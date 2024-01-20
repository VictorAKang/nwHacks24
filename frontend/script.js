
class Student {
    constructor( name, sid ) {
        this.name = name;
        this.sid = sid;
    }
}

class Instructor {
    constructor(name, entry) {
        this.name = name;
        this.entry = entry;
    }
}


class Entry {
    constructor( student, question, category ) {
        this.readyToTalk = false;
        this.asker= student;
        this.question = question;
        this.category = category;
        this.followers = [];
    }

    addFollower( persons ) {
        this.followers.push( ...persons );
    }

    // flips the readyToTalk field
    flipReadyToTalk() {
        this.readyToTalk = !this.readyToTalk;
    }
}

class Queue {
    constructor() {
        this.q = [];
    }

    // only add this entry if the student is not present
    addQuestion( entry ) {
      
      const studentInQueue = this.q.some(existingEntry =>   existingEntry.asker.sid === entry.asker.sid);

      if (!studentInQueue) {
          this.q.push(entry);
          console.log(`${entry.asker.name}'s question added to the queue.`);
      } else {
          console.log(`${entry.asker.name}'s question not added to the queue. Student is already in the queue.`);
      }
    }


    //assume that entry is someone who is readytotalk
    // assume that the q is not empty
    // TODO: check if the q is empty
    closeQuestion( entry ){
      console.log(`${entry.asker.name}'s question closed.`);
      this.q.remove( entry );
    }
}

var q;

function getEntry() {
  // form is the form of adding a new question
  const form = document.getElementById( 'questionForm' );
  const inputs = new FormData( form );

  for (const [key, value] of inputs) {
    console.log(`${key}: ${value}\n`);
  }
  // console.log( inputs.get('sid'))
  // inputs[ 0 ] - name
  // inputs[ 1 ] - student id
  // inputs[ 2 ] - question
  // inputs[ 3 ] - category deprecated for now

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
  
  // console.log(inputs)
  var s = new Student( inputs.get( 'name' ), inputs.get( 'sid' ) );
  var e = new Entry( s, inputs.get( 'question' ), inputs.get( 'category' ) )
  q.addQuestion( e ); 
  alert( "Question added to the queue" );
  console.log(q)
  // alert( q );
  window.location.href = 'queue.html';
}

function start() {
  q = new Queue();
}


const formSubmitButton = document.getElementById( 'submitQuestion' );
// formSubmitButton.addEventListener( 'submit', getEntry );
formSubmitButton.addEventListener( "click", getEntry);

