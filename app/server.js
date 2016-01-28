// see: 
// https://nodejs.org/dist/latest-v4.x/docs/api/
(function() {
	var fs = require('fs');
	var http = require('http');
	var path = require('path');
	var url = require('url');

	var port = process.env.PORT || 8080;

	var mimeTypes = {
		'.css': 'text/css',
		'.htlm': 'text/html',
		'.js': 'text/javascript'
	};

	var urlFileMap = {
		'/': '/index.html',
	};

	// to verify environment setting.
	// console.log('env: ' + process.env.NODE_ENV);
	// console.log('current working directory: ' + process.cwd());

	http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;
		var name = urlFileMap[pathname] || pathname;
		getFile(name, response);
	}).listen(parseInt(port, 10));

	console.log('Server running at http://localhost:' + port);

	function getFile(name, response) {
		var fileName = 'app' + name; // concat to directory to limit file access.
		fs.stat(fileName, function(error, stats) {
			if (error) {
				console.log('fs.stat error: ' + error + '\n');
				response.writeHead(500, {
					'Content-Type': 'text/plain'
				});
				response.write(error + '\n');
				response.end();
			} else if (!stats.isFile()) {
				response.writeHead(404, {
					'Content-Type': 'text/plain'
				});
				response.write('404 Not Found\n');
				response.end();
			} else {
				fs.readFile(fileName, function(error, file) {
					if (error) {
						console.log('fs.readFile error: ' + error + '\n');
						response.writeHead(500, {
							'Content-Type': 'text/plain'
						});
						response.write(error + '\n');
						response.end();
					} else {
						header = {
							'Content-Type': mimeTypes[path.extname(name)]
						};
						response.writeHead(200, header);
						response.end(file);
					}
				});
			}
		});
	}
})();
