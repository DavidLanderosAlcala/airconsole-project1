var Benchmark = require("benchmark");
var suite = new Benchmark.Suite;

var targered_listeners = [
    { callback : function(event) { return true; }, body1 : "sensor", body2 : "ball" },
    { callback : function(event) { return false; }, body1 : "sensor", body2 : "ball2" }
];

var fake_events = [
    {bodyA:"sensor", bodyB : "ball"},
    {bodyA:"sensor", bodyB : "rock1"},
    {bodyA:"rock1", bodyB : "rock2"},
    {bodyA:"ball", bodyB : "platform1"},
    {bodyA:"ball", bodyB : "Body"},
    {bodyA:"Body", bodyB : "Body"},
    {bodyA:"ball", bodyB : "sensor"},
    {bodyA:"sensor", bodyB : "ball"},
    {bodyA:"sensor", bodyB : "rock1"},
    {bodyA:"rock1", bodyB : "rock2"},
    {bodyA:"ball", bodyB : "platform1"},
    {bodyA:"ball", bodyB : "Body"},
    {bodyA:"Body", bodyB : "Body"},
    {bodyA:"ball", bodyB : "sensor"},    
];

function on(type, arg1, arg2, arg3)
{
	if(type == "beginContactBetween")
	{
		targered_listeners.push({
			callback : arg3,
			body1 : arg1,
			body2 : arg2,
		});
	}
	else if(type == "endContactBetween")
	{
		// targered_listeners.push({
		// 	callback : arg3,
		// 	body1 : arg1,
		// 	body2 : arg2,
		// });
	}	
	else
	{
		var callback = arg1;
	}
}

function TriggerEvents_v1()
{
	for(var i = 0; i < fake_events.length; i++)
	{
		onBeginContact_v1(fake_events[i]);
	}
}

function onBeginContact_v1(event)
{
    for(var i = 0; i < targered_listeners.length; i++)
    {
    	if(event.bodyA == targered_listeners[i].body1 || event.bodyB == targered_listeners[i].body1)
    	{
    		if(event.bodyA == targered_listeners[i].body2 || event.bodyB == targered_listeners[i].body2)
    		{
                targered_listeners[i].callback(event);
    		}
    	}
    }
}

function TriggerEvents_v2()
{
	for(var i = 0; i < fake_events.length; i++)
	{
		onBeginContact_v2(fake_events[i]);
	}
}

function onBeginContact_v2(event)
{
    for(var i = 0; i < targered_listeners.length; i++)
    {
    	if((event.bodyA == targered_listeners[i].body1 && event.bodyB == targered_listeners[i].body2) || (event.bodyA == targered_listeners[i].body2 && event.bodyB == targered_listeners[i].body1))
    	{
            targered_listeners[i].callback(event);
    	}
    }	
	//var ba = event.bodyA;
	//var bb = event.bodyB;
	//var b1,b2;
    //for(var i = 0; i < targered_listeners.length; i++)
    //{
    //	b1 = targered_listeners[i].body1;
    //	b2 = targered_listeners[i].body2;
    //	if((ba == b1 && bb == b2) || (bb == b1 && ba == b2))
    //	{
    //        targered_listeners[i].callback(event);
    //	}
    //}
}

on("beginContactBetween", "sensor", "ball", function(event) {

    var str = "Contacto entre : " + event.bodyA + " y " + event.bodyB;
    //console.log(str);

});

// add tests
suite.add('V1', TriggerEvents_v1)
.add('V2', TriggerEvents_v2)


.on('cycle', function(event) {
  console.log(String(event.target));
})

.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})

.run({ 'async': true });