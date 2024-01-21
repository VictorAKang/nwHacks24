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
        this.currentQuestion = null;
        this.currentSids = [];
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
      this.updateCurrentQuestion();
    }

    //assume that entry is someone who is readytotalk
    // assume that the q is not empty
    // TODO: check if the q is empty
    closeQuestion( entry ){
      console.log(`${entry.asker.name}'s question closed.`);
      this.q.remove( entry );
      this.updateCurrentQuestion();
    }
    
    parseToJSON() {
        var outStr = "";
        
        this.q.forEach( entry => {
            // console.log( entry )
            outStr = outStr.concat( '€', entry.parseToJSON() );
        });

        if( outStr == "" ) return "";
        return outStr.slice(1);
    }

    updateCurrentQuestion() {
        if (this.q.length === 0) {
            this.currentQuestion = null;
            this.currentSids = [];
            return;
        }
        this.currentQuestion = this.q[0];
        this.currentSids = [ this.q[0].asker.sid ];
        this.q[0].followers.forEach( entry => {
            this.currentSids.push( entry.sid );
        });
    }

    removeQuestionBySID( sid ) {
        console.log(sid)
        console.log(typeof(sid))
        let index = 0;
        this.q.forEach( entry => {
            // console.log( sid, entry, Number(sid) == entry.asker.sid );
            if (entry.asker.sid === Number( sid ) ) {
                this.q.splice(index, 1);
                console.log( 'Successfully removed the question: ' + entry.question + `of sid ${entry.asker.sid}` );
                return entry;
            }
            index++;
        });
        // for( var i=this.q.length-1; i >= 0 ; i-- ) {
        //     var entry = this.q[ i ];
        //     if( entry.asker.sid === sid ) {
        //         this.q.splice( index, 1 );
        //         console.log( `Successfully removed the question ${entry.question}` );
        //     }
        // }
    }

    addFollowerToQuestion( questionSID, studentSID, studentName ) {
        this.q.forEach( entry => {
            if (entry.asker.sid ===  questionSID) {
                entry.followers.push(new Student(studentName, studentSID));
                console.log( studentSID + ' successfully added to the question: ' + entry.question );
                return;
            }
        });
    }

    checkCurrentSids( data ) {
        // console.log( data.sid )
        if( data.sid == undefined ) return "";
        var sids = data.sids.slice( 1, -1 ).split( ',' ).map( c => Number( c.slice( 1, -1 ) ) );
        // console.log( sids )

        var retStr = "";

        console.log(this.currentSids)
        console.log(sids)
        // console.log( sids[0] === this.currentSids[0])
        sids.forEach( entry => {
            if( this.currentSids.some( c => c === entry ) ){ 
                retStr += ' ' + entry;
                // console.log('a')
            }
        });

        console.log( retStr );

        return retStr;
        // return sids.some( ( sid ) => sid in this.currentSids );
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
    res.send();
  });

  app.get( '/', function(req, res) {
    console.log('Got get request!');
    res.send( "hello there!" );
  });
  
  app.get( '/getQueue', function(req, res) {
    console.log('Recieved a GET call for the queue!');
    console.log( q.parseToJSON() );
    res.send( JSON.stringify( { "q":q.parseToJSON() }) );
  });

  app.get( '/getCurrentQuestion', function(req, res) {
    console.log('Received a GET call for the queue current question!');
    console.log( q.currentQuestion.parseToJSON() );
    res.send( q.currentQuestion.parseToJSON() );
  });

  app.post( '/removeQuestionBySID', function(req, res) {
    console.log( 'Received a POST call to remove a question by SID');
    console.log( req.body );
    const removedQuestion = q.removeQuestionBySID( req.body.sid );
    console.log( q )
    // console.log( removedQuestion.parseToJSON() );
    // res.send( removedQuestion.parseToJSON() );
  });

  app.post( '/addFollowerToQuestion', function(req, res) {
    console.log( 'Received a POST call to add follower to a question with the data:' );
    console.log( req.body );
    q.addFollowerToQuestion( req.body );
    res.send( "Success!" );
  });

  app.post( '/getCurrentSids', function( req, res ) {
    console.log( 'Recieved a POST call to check currentSids' );
    console.log( req.body )
    res.send( q.checkCurrentSids( req.body ) );
  });

  app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
  });
}

start();
