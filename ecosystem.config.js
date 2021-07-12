const os = require('os');

function getIpAddress() {
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        var iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
}

const Host = getIpAddress();

module.exports = {
    apps: [
    {
        name: 'API',
        script: 'server.js',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        args: 'one two',
        instances: 1,
        autorestart: true,
        watch: false,
        exec_mode: 'fork',
        max_memory_restart: '1G',
        env: {
        NODE_ENV: 'development',
        HOST: Host
        },
        env_production: {
        NODE_ENV: 'production',
        HOST: Host
        },
    },
    ],
}