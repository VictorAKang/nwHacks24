
class Person {
    constructor( name, email, sid ) {
        this.name = name;
        this.email = email;
        this.sid = sid;
    }
}

class Entry {
    constructor( person, question, tag ) {
        this.readyToTalk = false;
        this.owner= person;
        this.question = question;
        this.tag = tag;
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

    addQuestion( person ) {
        
    }

    closeQuestion(  )
}



function start() {

}