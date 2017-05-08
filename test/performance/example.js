var Benchmark = require("benchmark");

var timestamp = 0;
var fps = 0;

var newtimestamp = 0;
var elapsedtime  = 0;
var new_fps = 0;

update1();
update2();

var suite = new Benchmark.Suite;

// add tests
suite.add('update1', update1)
.add('update2', update2)


.on('cycle', function(event) {
  console.log(String(event.target));
})

.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})

.run({ 'async': true });


function update1()
{
	for(var i = 0; i < 99; i++)
	{
	    newtimestamp = new Date().getTime();
        elapsedtime = newtimestamp - timestamp;
        timestamp = newtimestamp;
        //if(elapsedtime > 500)
        //    elapsedtime = 500;
        //world.step(elapsedtime/1700); // time scaled 0.58x
        new_fps = 1000 / (elapsedtime);
        if(new_fps != fps)
        {
            fps = new_fps;
            //title_bar.innerHTML = "fps: " + fps;
        }
    }
}

function update2()
{
	for(var i = 0; i < 99; i++)
	{
	    var newtimestamp = new Date().getTime();
        var elapsedtime = newtimestamp - timestamp;
        timestamp = newtimestamp;
        if(elapsedtime > 500)
            elapsedtime = 500;
        //world.step(((elapsedtime/1000))/1.7);
        var new_fps = 1 / (elapsedtime/1000)|0;
        if(new_fps != fps)
        {
            fps = new_fps;
            //title_bar.innerHTML = "fps: " + fps;
        }
    } 
}