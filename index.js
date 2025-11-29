const { Client } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode'); // Só uma vez!

const app = express();
const client = new Client({
    authStrategy: new (require('whatsapp-web.js').LocalAuth)()
});

let latestQR = null;

client.on('qr', (qr) => {
    latestQR = qr;
    console.log('QR code recebido!');
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
});

app.get('/', async (req, res) => {
    if (!latestQR) {
        return res.send('<h2>QR code ainda não gerado. Aguarde...</h2>');
    }
    try {
        const qrImage = await qrcode.toDataURL(latestQR);
        res.send(`
            <h1>Escaneie o QR code abaixo para conectar o WhatsApp:</h1>
            <img src="${qrImage}" />
        `);
    } catch (err) {
        res.status(500).send('Erro ao gerar QR code');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor web rodando na porta ${PORT}`);
});

client.initialize();