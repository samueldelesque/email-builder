var juice = require('juice2'),
	fs = require('fs'),
	http = require('http'),
	watch = require('node-watch'),
	rootpath = process.cwd(),
	templatesPath = rootpath+"/templates/",
	disregardFiles = [".DS_Store",".hide",".git",".deleteme","css"],
	routes = {},
	port = 3000


function renderTemplate(path){
	juice(templatesPath+path, function(err, html) {
		if(err){console.log(path,"Path not found");}
		routes["/"+path] = html
		console.log(path,"ready.")
	})
}

fs.readdir(templatesPath,function(err,templates){
	if(err){ console.error("Could not open templates dir!",err); return;}

	templates.forEach(function(path){
		if(disregardFiles.indexOf(path) == -1){
			renderTemplate(path)

			// watch folder for changes
			watch(templatesPath+path, function(filename) {
				renderTemplate(path)
			});
		}
	});
})

http.createServer(function(req,res){
	console.log("Requesting",req.url)
	if(!routes[req.url]){
      res.writeHead(404, {"Content-Type": "text/plain"})
      res.write("404 Not Found\n")
      res.end()
      return
	}
	else{
      res.writeHead(200)
      res.write(routes[req.url])
      res.end()
	}
}).listen(port)

console.log("Templates served on http://localhost:"+port+"/")