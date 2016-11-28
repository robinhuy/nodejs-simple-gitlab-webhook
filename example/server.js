const http = require('http');
const spawn = require('child_process').spawn;
const config = require('./config');

const PORT = 8000;

// Create server
var server = http.createServer((request, response) => {
    // Only accept POST request
    if (request.method == 'POST' && request.headers['x-gitlab-event'] == 'Push Hook') {
        var body = '';

        request.on('data', data => {
            body += data;
        });

        request.on('end', () => {
            // Parse data to Object
            try {
                body = JSON.parse(body);
            } catch (error) {
                console.log(error);
                response.end();
            }
            
            for (project of config.projects) {
                if ((body.repository && project.url == body.repository.url) 
                    || (body.project && project.url == body.project.url)) {
                    
                    // Run Script
                    const deploy = spawn('./deploy.sh', [project.path, project.container]);

                    deploy.on('close', code => {
                        console.log(`Script exited with code ${code}`);
                    });

                    break;
                }
            }

            response.end();
        });
    } else {
        response.end();
    }
});

// Start server
server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});
