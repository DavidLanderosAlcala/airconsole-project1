var http = require("http");
var fs   = require('fs');
var URL  = require("url");

var PORT = 12345;
var PUBLIC_DIC = "./../src/";


var server = http.createServer(function(request, response){

    if(request.method == "GET") {

        // parsing url
    	var url = URL.parse(request.url, true);
    	if(url.pathname == "/")
    		url.pathname = "/index.html";
    	url.pathname = "." + url.pathname;
        console.log("new request: " + request.connection.remoteAddress + ", " + url.pathname);
    	if(fs.existsSync( PUBLIC_DIC + url.pathname))
    	{
            response.writeHead(200, {"Content-Type" : getMimeType(url.pathname) });
            response.end(fs.readFileSync(PUBLIC_DIC + url.pathname));
    	}
    	else { notfound(response); }

    }
    else { notfound(response); }

});

server.listen(PORT);

function getMimeType(filename)
{
    if(filename.endsWith(".jpg"))
        return "image/jpeg";
    if(filename.endsWith(".png"))
        return "image/png";
    if(filename.endsWith(".gif"))
        return "image/gif";
    if(filename.endsWith(".js"))
        return "application/javascript; charset=utf-8";
    if(filename.endsWith(".json"))
        return "application/json; charset=utf-8";
    if(filename.endsWith(".css"))
        return "text/css; charset=utf-8";
    return "text/html; charset=utf-8";
}

function notfound(response)
{
    response.writeHead(404);
    response.end("Not found");
}