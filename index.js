var juice = require('juice2'),
	fs = require('fs'),
	http = require('http'),
	watch = require('node-watch'),
	disregardFiles = [".DS_Store",".hide",".git",".deleteme","css","less","scss","sass"],
	routes = {},
	port = 3728,
	basePath = process.cwd()+"/"

console.log("\x1B[36m");
console.log("");
console.log("           DS EMAIL BUILDER");
console.log("");
console.log("\x1B[0m");

function renderTemplate(inputdir,outputdir,path){
	juice(inputdir+path, function(err, html) {
		if(err){console.log(path,"Path not found");}
		routes["/"+path] = html
		fs.writeFile(outputdir+path, html, function(err){
			if(err){
				console.error("Failed to write",outputdir+path,"!");
			}
			else{
				console.log(outputdir+path,"was rendered.")
			}
		})
	})
}
function parseInput(inputdir,outputdir,dir){
	fs.readdir(inputdir+dir,function(err,templates){
		if(err){ console.error("Could not open templates dir!",err); return;}

		templates.forEach(function(path){
			if(disregardFiles.indexOf(path) == -1){
				renderTemplate(inputdir,outputdir,path)

				// watch folder for changes
				watch(inputdir+dir+path, function(filename) {
					renderTemplate(inputdir,outputdir,path)
				});
			}
		});
	})
}

if(!process.argv[2] || !process.argv[3]){
	console.error("Please specify a valid input and output dir (node ds-email-builder /input/path /output/path)")
	process.kill()
}
else{
	var inputPath = process.argv[2].replace(/\/+$/, "")+"/",
		outputPath = process.argv[3].replace(/\/+$/, "")+"/"

	if(inputPath.substr(0,1) != "/"){
		inputPath = basePath + inputPath;
	}
	if(outputPath.substr(0,1) != "/"){
		outputPath = basePath + outputPath;
	}

	console.log("Starting email processing",inputPath,outputPath);

	fs.lstat(inputPath, function(err, stats) {
		if (!err && stats.isDirectory()){
	    	parseInput(inputPath,outputPath,"")
		}
	})
	fs.lstat(outputPath, function(err, stats) {
		if (err || !stats.isDirectory()) {
			console.error("Invalid output directory!",outputPath)
			process.kill()
		}
	})
}


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