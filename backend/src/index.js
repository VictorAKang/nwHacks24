const express = require( "express" );
const cors = require( "cors" )

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

  parseToJSON() {
    const entryObject = {
      readyToTalk: this.readyToTalk,
      asker: {
        name: this.asker.name,
        sid: this.asker.sid
      },
      question: this.question,
      category: this.category,
      followers: this.followers.map(follower => ({
        name: follower.name,
        sid: follower.sid
      }))
    };
    return JSON.stringify(entryObject);
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

      
        //this.q.push( entry );
    }

    //assume that entry is someone who is readytotalk
    // assume that the q is not empty
    // TODO: check if the q is empty
    closeQuestion( entry ){
      console.log(`${entry.asker.name}'s question closed.`);
      this.q.remove( entry );
    }

  parseToJSON() {
    
  }
}

var q;

function start() {
  q = new Queue();

  const app = express();
  const port = 3000;

  app.use( express.json() );
  app.use( cors() );

  app.post( "/addEntry", function ( req, res ) {
    console.log( req.body );
  });

  app.get( '/', function(req, res) {
    console.log('Got get request!');
    res.send( "hello there!" );
  });

  app.listen(port, '0.0.0.0', function () {
    console.log(`Example app listening on port ${port}!`);
  });
}

start()