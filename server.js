const http = require('http');
const spawn = require('child_process').spawn;

const PORT = 8000;
const SCRIPT_PATH = '/home/huy/gitlab-watcher/test.sh';

// Create server
var server = http.createServer((request, response) => {
    // Only accept POST request
    if (request.method == 'POST') {
        var body = '';

        request.on('data', data => {
            body += data;
        });

        request.on('end', () => {
            try {
                // Parse data to Object
                body = JSON.parse(body);
                
                // Run script if action is Push
                if (body.object_kind == 'push') {
                    const deploy = spawn('bash', [SCRIPT_PATH]);

                    deploy.on('close', code => {
                        console.log(`Script exited with code ${code}`);
                    });
                }

                response.end();
            } catch (error) {
                console.log(error);
                response.end();
            }
        });
    } else {
        response.end();
    }
});

// Start server
server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});
