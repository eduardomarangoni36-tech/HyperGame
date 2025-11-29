const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const qrcode = require('qrcode');
const app = express();

let latestQR = null;

client.on('qr', (qr) => {
    latestQR = qr;
    console.log('QR RECEIVED');
});

app.get('/', async (req, res) => {
    if (!latestQR) {
        return res.send('QR code ainda não gerado. Aguarde...');
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