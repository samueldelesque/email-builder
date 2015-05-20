#! /usr/bin/env node

var Emailizer = require('../emailizer'),
	basePath = process.cwd()+"/",
	staticServer = require('node-static'),
	open = require("open"),
	module_path = __dirname.replace("bin",""),
	usage = ["watch","create"],
	port = 3729

console.log("\x1B[36m")
console.log("")
console.log("EMAILIZER")
console.log("")
console.log("\x1B[0m")

function serveStatic(dir,port){
	var server = new staticServer.Server(dir)

	http.createServer(function (req, res) {
		req.addListener('end', function () {
			server.serve(req, res);
		}).resume()
	}).listen(port)
}

if(!process.argv[2] || process.argv[2] == "help" || usage.indexOf(process.argv[2]) == -1){
	console.log("");
	console.log("usage: emailizer [create NAME] [watch ./SOURCE ./DEST]");
	console.log("");
	process.exit()
}
else{
	if(process.argv[2] == "watch"){
		if(!process.argv[3] || !process.argv[4]){
			console.error("Please specify a valid SOURCE and DEST directory")
			process.exit()
		}
		else{
			var source = process.argv[3]
				dest = process.argv[4]

			if(source.substr(0,1) != "/"){
				source = basePath + source;
			}
			if(dest.substr(0,1) != "/"){
				dest = basePath + dest;
			}

			fs.lstat(source, function(err, stats) {
				if (!err && stats.isDirectory()){
			    	Emailizer.watch(source,dest,function(err,message){
			    		if(err){
			    			console.error(err);
			    		}
			    		else{
			    			console.log(message);
			    		}
			    	})
					serveStatic(dest,port)
				}
			})
			fs.lstat(dest, function(err, stats) {
				if (err || !stats.isDirectory()) {
					console.error("Invalid output directory!",dest)
					process.exit()
				}
			})
		}
	}
	else if(process.argv[2] == "create"){
		if(!process.argv[3]){
			console.error("Please specify a valid email name")
			process.exit()
		}
		else{
			var newdir = process.argv[3].replace(/\/+$/, "")+"/"
			fs.mkdirs(newdir,function(err){
				if(err) console.log(err)
				else fs.copy(module_path+"source",newdir+"source",function(err){
 					if (err) return console.error(err)
 					else{
 						fs.mkdirs(newdir+"render", function(err){
 							if(err)console.error(err)
 							else{
 								Emailizer.watch(newdir+"source/",newdir+"render/",function(err,message){
									if(err){
										console.error(err);
									}
									else{
										console.log(message);
									}
								})
	 							serveStatic(newdir+"render/",port)
 							}
 						})
 					}
				})
			})
		}
	}
}
