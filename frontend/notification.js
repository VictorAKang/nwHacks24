function showNotif() {
    return;
}

function callbackNotif( data ) {
    // console.log( data == "" )
    if( data == "" ) return;
    if( data != undefined ) { 
        sids = JSON.parse(localStorage.getItem( "sid" ));
        console.log(typeof(sids))
        var sidsTR = data.trim().split( " " );
        // console.log( sidsTR.length)
        for( var i=0; i < sidsTR.length; i++ ) {
            sid = sidsTR[ i ];
            console.log(sids)
            // console.log(sid.indexOf(sid.toString()));
            sids.splice( sids.indexOf( sid.toString() ), 1 );
            console.log( `deleting ${sid}`);
            console.log( sids)
        };
        localStorage.setItem( "sid", JSON.stringify(sids) );
        alert( `Your turn ${data}!!` );
    }
}

function checkNotif( callback ) {
    var sids = localStorage.getItem( "sid" );
    // console.log( sids.toString())
    if( sids == null )
        return;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(xmlHttp.responseText);
            callbackNotif( xmlHttp.responseText );   
            callback();
        }

    }
    xmlHttp.open("POST", "http://localhost:3000/getCurrentSids"); // true for asynchronous
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send( JSON.stringify({"sids":sids.toString()} ));
    // xmlHttp.send( "hello")
}

function update() {
    setTimeout( () => {
        console.log( 'checking for notif' );
        checkNotif( () => update() );
    }, 10000 );
}

update()
// sids = localStorage.getItem( "sid" );
// sids = sids.slice( 1, -1 );
// console.log( sids.split( ',').map( c => Number( c.slice( 1, -1 ) ) ) );
// checkNotif();
