var juice = require('juice2'),
	fs = require('fs-extra'),
	http = require('http'),
	Watch = require('node-watch'),
	disregardFiles = [".DS_Store",".hide",".git",".deleteme","css","less","scss","sass"]

function appendTrailingSlash(dir){
	return dir.replace(/\/+$/, "")+"/"
}

var Emailizer = {
	render: function(inputdir, outputdir, path, callback){
		var s = this
		callback = callback || function () {}
		inputdir = appendTrailingSlash(inputdir)
		outputdir = appendTrailingSlash(outputdir)
		juice(inputdir+path, {preserveMediaQueries: true}, function(err, html) {
			if(err){
				callback(inputdir+path+" not found")
			}
			else{
				fs.writeFile(outputdir+path, html, function(err){
					if(err){
						callback("Failed to write "+outputdir+path+"!")
					}
					else{
						callback(false, {path:outputdir+path})
					}
				})
			}
		})
	},

	parseDirectory: function(inputdir, outputdir, callback){
		var s = this,
			results = []

		callback = callback || function () {}
		fs.readdir(inputdir,function(err,templates){
			if(err){
				callback(err)
			}
			else{
				templates.forEach(function(path){
					if(disregardFiles.indexOf(path) == -1){
						s.render(inputdir, outputdir, path, function(err,file){
							if(err){
								callback(err);
							}
							else{
								results.push(file.path)
								if(results.length == templates.length){
									callback(false, results)
								}
							}
						})

						// watch folder for changes
						Watch(inputdir+path, function(filename) {
							s.render(inputdir, outputdir, path, function(err,file){if(!err)callback([file])})
						})
					}
				})
			}
		})
		return s
	},

	// @param callback: function(err, list)
	// @callback list = [{path:/path/to/template},{path:/path/to/template2}]
	watch: function(inputdir,outputdir, callback){
		var s = this
		callback = callback || function () {}
		if(!inputdir||!outputdir){callback("Please specify a valid input and output directory!");}
		return s.parseDirectory(inputdir, outputdir, callback)
	}
}

module.exports = Emailizer
