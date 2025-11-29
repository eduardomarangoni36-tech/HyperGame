const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    // Se quiser salvar como imagem, descomente abaixo:
    // const QRCode = require('qrcode');
    // QRCode.toFile('qrcode.png', qr, function (err) {
    //     if (err) throw err;
    //     console.log('QR code salvo como qrcode.png');
    // });
});

client.on('ready', () => {
    console.log('Bot está pronto!');
});

client.on('group_join', async (notification) => {
    const userId = notification.recipientIds[0];
    const chat = await client.getChatById(notification.chatId);

    // Mensagem de boas-vindas com menção
    const welcomeText = `👋 Seja bem-vindo(a) @${userId.split('@')[0]} ao grupo Hyperloaders! 🚀\n#Hyperloaders #BemVindo`;
    await chat.sendMessage(welcomeText, {
        mentions: [userId]
    });

    // Aguarda 2 segundos e envia as regras
    setTimeout(() => {
        const rules = `📜 *Regras do grupo Hyperloaders:*\n
1️⃣ Respeite todos os membros.
2️⃣ Não compartilhe spam.
3️⃣ Use o grupo para assuntos relacionados ao tema.
4️⃣ Seja colaborativo!
🚀 #Hyperloaders #Regras`;
        chat.sendMessage(rules);
    }, 2000);
});

client.on('message', async msg => {
    // Comando /Help
    if (msg.body.toLowerCase() === '/help') {
        msg.reply('🤖 *Comandos disponíveis:*\n/help - Mostra esta mensagem\n/girar dados - Gira um dado de 1 a 6 e te menciona!');
    }

    // Comando /girar dados
    if (msg.body.toLowerCase() === '/girar dados') {
        const dado = Math.floor(Math.random() * 6) + 1;
        const mention = [msg.author || msg.from];
        msg.reply(`🎲 Você tirou: *${dado}*`, undefined, { mentions: mention });
    }
});

client.initialize();