// #! /usr/bin/env node
var juice = require('juice2'),
	fs = require('fs'),
	http = require('http'),
	staticServer = require('node-static'),
	Watch = require('node-watch'),
	disregardFiles = [".DS_Store",".hide",".git",".deleteme","css","less","scss","sass"],
	routes = {},
	port = 3729,
	basePath = process.cwd()+"/",
	usage = ["watch","create"]

var Emailizer = {
	settings: {
		inputdir: "",
		outputdir: ""
	},
	staticServer: {},

	init: function(){
		var s = this
		console.log("\x1B[36m");
		console.log("");
		console.log("EMAILIZER");
		console.log("");
		console.log("\x1B[0m");
	},

	renderTemplate: function(path){
		var s = this
		juice(s.settings.inputdir+path, function(err, html) {
			if(err){console.log(path,"Path not found");}
			// routes["/"+path] = html
			fs.writeFile(s.settings.outputdir+path, html, function(err){
				if(err){
					console.error("Failed to write",s.settings.outputdir+path,"!");
				}
				else{
					console.log(s.settings.outputdir+path,"was rendered.")
				}
			})
		})
	},
	parseInput: function(){
		var s = this
		fs.readdir(s.settings.inputdir,function(err,templates){
			if(err){ console.error("Could not open templates dir!",err); return;}

			templates.forEach(function(path){
				if(disregardFiles.indexOf(path) == -1){
					s.renderTemplate(path)

					// watch folder for changes
					Watch(s.settings.inputdir+path, function(filename) {
						s.renderTemplate(path)
					})
				}
			})
		})
	},
	serveRender: function(){
		var s = this
		s.staticServer = new static.Server(s.settings.outputdir)

		http.createServer(function (req, res) {
			req.addListener('end', function () {
				s.staticServer.serve(req, res);
			}).resume()
		}).listen(port)

		console.log("App files are now served on port "+port);
	},


	watch: function(inputdir,outputdir){
		var s = this
		s.settings.inputdir = inputdir
		s.settings.outputdir = outputdir

		s.parseInput()
	}
}

if(!process.argv[2] || process.argv[2] == "help" || usage.indexOf(process.argv[2]) == -1){
	console.log("");
	console.log("usage: emailizer [create NAME] [watch ./SOURCE ./DEST]");
	console.log("");
	process.kill()
}
else{

	Emailizer.init();

	if(process.argv[2] == "watch"){
		if(!process.argv[3] || !process.argv[4]){
			console.error("Please specify a valid SOURCE and DEST directory")
			process.kill()
		}
		else{
			var source = process.argv[3].replace(/\/+$/, "")+"/",
				dest = process.argv[4].replace(/\/+$/, "")+"/"

			if(source.substr(0,1) != "/"){
				source = basePath + source;
			}
			if(dest.substr(0,1) != "/"){
				dest = basePath + dest;
			}

			fs.lstat(source, function(err, stats) {
				if (!err && stats.isDirectory()){
			    	Emailizer.watch(source,dest)
				}
			})
			fs.lstat(dest, function(err, stats) {
				if (err || !stats.isDirectory()) {
					console.error("Invalid output directory!",dest)
					process.kill()
				}
			})
		}
	}
	else if(process.argv[2] == "create"){
		console.log("Create function is under construction....");
	}
}
