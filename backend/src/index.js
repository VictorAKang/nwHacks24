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
        var followersStr = "";

        this.followers.forEach( entry=> {
            var s = JSON.stringify( {
                name: entry.name,
                sid: entry.sid
            });
            followersStr = followersStr.concat( '¥', s );
        });

        const entryObject = {
            readyToTalk: this.readyToTalk,
            asker: {
                name: this.asker.name,
                sid: this.asker.sid
            },
            question: this.question,
            category: this.category,
            // followers: this.followers.map(follower => ({
            //     name: follower.name,
            //     sid: follower.sid
            // }))
            followers: followersStr
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
        // var returnArray = [];
        // this.q.forEach(entry => {
        //   console.log(entry);
        //   console.log(entry.parseToJSON());
        //   returnArray.push(JSON.stringify(entry.parseToJSON()));
        // });
        // return returnArray;

        var outStr = "";
        
        this.q.forEach( entry => {
            // console.log( entry )
            outStr = outStr.concat( '€', entry.parseToJSON() );
        });

        return outStr.slice(1);
    }
}

var q;

function addEntry( body ) {
    // var j = JSON.parse( body );
    var s = new Student( body.name, body.sid );
    var e = new Entry( s, body.question, body.category );
    q.addQuestion( e );
}

function start() {
  q = new Queue();

  q.addQuestion(new Entry(new Student("Bowen", 49604481), "What is 1+1?", "Other"));
  q.addQuestion(new Entry(new Student("Bowen1", 496044811), "What is 2+2?", "Other1"));
  q.addQuestion(new Entry(new Student("Bowen2", 496044812), "What is 3+3?", "Other2"));

  const app = express();
  const port = 3000;

  app.use( express.json() );
  app.use( cors() );

  app.post( "/addEntry", function ( req, res ) {
    console.log( "Got request to add Entry with the following data:" );
    console.log( req.body );
    addEntry( req.body );
  });

  app.get( '/', function(req, res) {
    console.log('Got get request!');
    res.send( "hello there!" );
  });
  
  app.get( '/getQueue', function(req, res) {
    console.log('Recieved a GET call for the queue!');
    console.log( q.parseToJSON() );
    res.send( q.parseToJSON() );
  });

  app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
  });
}

start();
