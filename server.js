const http = require('http');
const spawn = require('child_process').spawn;
const config = require('./config');

const PORT = 8000;

// Create server
var server = http.createServer((request, response) => {

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
                console.log("Invalid data");
                response.end();
            }
            
            for (project of config.projects) {
                if (project.url == body.repository.url || project.url == body.project.url) {
                    // Get Script Command & Args
                    let scripts = project.script.split(' ');
                    let command = scripts[0];
                    scripts.shift();

                    // Run Script
                    const deploy = spawn(command, scripts);
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
