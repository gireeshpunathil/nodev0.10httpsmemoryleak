
var heapdump= require('heapdump');
var request = require('request');


// SSL workaround
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Total number of requests which we fire in one go.
var REQUEST = 1000;

// Instantaneous request count.
var reqcount = 0;

// Instantaneous response count. We wait till this
// equals the request count, before taking a dump.
var rescount = 0;

// Errors, if any.
var errorcount = 0;

// A time keeper index.
var index = 0;

// time for app or any internal timers to quisce.
var SLEEPTIME = 60 * 1000;

// Frequency at which we check the transaction status.
var WAITTIME = 10 * 1000;

// Take dump for basline, before we do anything.
heapdump.writeSnapshot(function(err, filename) {
console.log('Baseline dump: ' + filename);
});


// At every 10 seconds, check whether we have processed REQUEST
// number of requests. If so, reset the counters, and repeat for 
// 20 times. Then wait for a minute before taking a dump.
// Otherwise, just print the statistics.
var se = setInterval(function(){
	if(index == 20) {
		clearInterval(se);
        console.log('waiting for a minute to clean everything, and getting the final dump ...');
		setTimeout(function() {
			dump();
		}, SLEEPTIME);
	}
	else if(reqcount == REQUEST && rescount == REQUEST) {
    console.log('Time: ' + ++index  * 10 + ' seconds, requests: ' + reqcount + ' error: ' + errorcount + ', responses : ' + rescount);
    reqcount = 0;
    rescount = 0;
    errorcount = 0;
//    dump();
    main();
}
else
    console.log('Time: ' + ++ index  * 10 + ' seconds, requests: ' + reqcount + ' error: ' + errorcount + ', responses : ' + rescount);
}, WAITTIME);


// Take a dump.
function dump() {
    heapdump.writeSnapshot(function(err, filename) {
    console.log(REQUEST + 'dump:' + filename);
});
}

// speed up?
//var option = { url: 'https://localhost:23456', agentOptions: {maxSockets: 256}};
var option = { url: 'https://localhost:23456'};

function perform(op) {
    // Start requesting.
        var req = request(option, function(er, res, body) {rescount++; if(er) {console.log(er); errorcount++;} });

    // If we reached the maximum requests, clear the timer, and wait for
    // responses to come in.
    if(++reqcount ==  REQUEST) {
    clearInterval(op);
    return;
    }
}

function main() {
var op = setInterval(function() { perform(op); }, 0);
}

// Start the loop.
main();


