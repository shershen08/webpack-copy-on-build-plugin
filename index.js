/**
 * @module WebpackCopyOnBuildPlugin
 */

/**
 * @constructor
 * @param {onBuildCallback} files - an array of objects
 * @param files[x].from - string filename. File should exist after webpack is done building.
 * @param files[x].to - string. files[x].from will be renamed to this.
 */
function WebpackCopyOnBuildPlugin(files) {
	console.log('Started webpack-rename-on-build with parameter ' + JSON.stringify(files));
	this.files = files;
}

WebpackCopyOnBuildPlugin.prototype.apply = function(compiler) {
	var files = this.files;
	compiler.plugin('done', function(stats) {
		files.forEach(function(file) {
			
			var to = file.to.replace('[hash]', stats.hash);
			var from = file.from.replace('[hash]', stats.hash);
			console.log('Copying from ' + to + ' to ' + from);

			var fs;
			if(compiler.outputFileSystem.constructor.name === 'MemoryFileSystem')
			{
				console.log('Using memory-fs ' + compiler.outputFileSystem.constructor);
				fs = compiler.outputFileSystem;
			}
			else
			{
				console.log('Using normal fs');
				fs = require('fs');
			}

			var rd = fs.createReadStream(from);

			rd.on('error', function (err) {
				done(err);
			});

			var wr = fs.createWriteStream(to);

			wr.on('error', function (err) {
				done(err);
			});

			wr.on('close', function (ex) {
				done();
			});

			rd.pipe(wr);

			function done(err) {
				if (!err) {
					console.log('Copied file file ' + from + ' to ' + to);
				}
				else {
					console.log(err);
				}
			}
		});
	});
};

module.exports = WebpackCopyOnBuildPlugin;