const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const SESSION_FILE_PATH = './session.json';

let sessionCfg = fs.existsSync(SESSION_FILE_PATH) ? require(SESSION_FILE_PATH) : null;
const client = new Client({ puppeteer: { headless: false }, session: sessionCfg });

client.on('qr', qr => console.log('QR RECEIVED', qr));
client.on('authenticated', session => {
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
});
client.on('auth_failure', msg => console.error('AUTHENTICATION FAILURE', msg));
client.on('ready', () => console.log('READY'));
client.on('message', msg => {
    if (msg.body.startsWith('62')) {
        const [target, jumlah, text] = msg.body.split("|");
        for (let i = 0; i < parseInt(jumlah); i++) {
            client.sendMessage(`${target}@c.us`, text);
        }
    }
});

client.initialize();
