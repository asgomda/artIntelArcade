let glitch;

const audio = document.querySelector('audio');

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    /* create glitch instance */
    //glitch = new Glitch();
    
    /* optional settings */
    // glitch.pixelate(1); // hard pixel edges (pixelDensity)
    // glitch.errors(false); // hide any bad data warnings
    // glitch.debug(); // show debugs - avoid if anything called in draw()
    // glitch.debug(false); // hide debug
}


// function keyListener(event){ 
//     //whatever we want to do goes in this block
//     event = event || window.event; //capture the event, and ensure we have an event
//     console.log(audio);
//     var key = event.key || event.which || event.keyCode; //find the key that was pressed
//     //MDN is better at this: https://developer.mozilla.org/en-US/docs/DOM/event.which
//     if(key===84){ //this is for 'T'
//         console.log(audio)
//     }
//   }

document.onkeydown = function(e){
    e = e || window.event;
    
    var key = e.key || e.which || e.keyCode;
    if(key===84){
        audio.setAttribute('')
    }
}