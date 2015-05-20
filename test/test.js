var chai = require('chai'),
	expect = chai.expect,
	fs = require('fs-extra'),
	Emailizer = require('../emailizer')

describe("Emailizer",function(){
	describe("render one file",function(done){
		it("Return an object with template path.",function(done){
			Emailizer.render("test/sample/source","test/sample/render","test.html",function(err,file){
				expect(err).to.be.notOk
				expect(file).to.have.property("path")
				done()
			})
		})
	})

	describe("watch a directory",function(done){
		it("Create files in the render directory.",function(done){
			Emailizer.watch("test/sample/source","test/sample/render",function(err,files){
				expect(err).to.be.notOk
				expect(files).to.be.an("array")
				var tocheck = files.length
				if(tocheck == 0)
					done()
				files.forEach(function(e,i){
					fs.lstat(files[i],function(err,stats){
						expect(err).to.be.notOk
						tocheck--
						if(tocheck == 0)
							done()
					})
				})
			})
		})
	})
})