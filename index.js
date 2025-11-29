const { Client } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
let latestQR = null;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    latestQR = qr;
    console.log('QR code recebido!');
});

app.get('/', async (req, res) => {
    if (!latestQR) {
        return res.send('<h2>QR code ainda não gerado. Aguarde...</h2>');
    }
    try {
        const qrImage = await qrcode.toDataURL(latestQR);
        res.send(`<h1>Escaneie o QR code abaixo:</h1><img src="${qrImage}" />`);
    } catch (err) {
        res.status(500).send('Erro ao gerar QR code');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor web rodando na porta ${PORT}`);
});

client.initialize();