const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escaneie o QR code acima com o WhatsApp!');
});

client.on('ready', () => {
    console.log('Cliente está pronto!');
});

// Mensagem de boas-vindas e regras
client.on('group_join', async (notification) => {
    const userId = notification.recipientIds[0];
    const mentions = [userId];

    const mensagemBoasVindas = `⚡🚀 Salve @${userId.split('@')[0]}!\nVocê acaba de entrar na zona de potência máxima 🔥\nAqui é onde o grupo Hyperloaders cresce, compartilha e acelera sem limites 💥\nPrepare-se para viver intensidade e união!\n#Hyperloaders #GameOn`;
    await client.sendMessage(notification.chatId, mensagemBoasVindas, { mentions });

    setTimeout(async () => {
        const regras = `📜 *Regras Hyperloaders*\n` +
            ` • 🔥 *Respeito sempre*: nada de ofensas, preconceito ou brigas.\n` +
            ` • ⚡ *Energia positiva*: mantenha o grupo com boas vibrações e motivação.\n` +
            ` • 🚀 *Conteúdo relevante*: compartilhe coisas que somem à galera (sem spam).\n` +
            ` • 💥 *Participação ativa*: todos são parte da tropa, então interaja!\n` +
            ` • 🎯 *Foco no objetivo*: lembre-se que estamos aqui para crescer juntos.\n` +
            ` • 🛡️ *Privacidade*: não compartilhe informações pessoais sem permissão.\n` +
            ` • 🌍 *Unidade*: somos Hyperloaders, a força está na união`;
        await client.sendMessage(notification.chatId, regras);
    }, 2000);
});

// Comandos do grupo
client.on('message', async (msg) => {
    const chat = await msg.getChat();

    // Só responde em grupo
    if (!chat.isGroup) return;

    // Comando /Help
    if (msg.body.toLowerCase() === '/help') {
        await msg.reply(
            '📖 *Comandos disponíveis:*\n' +
            '• /Help - Mostra esta mensagem de ajuda\n' +
            '• /girar dados - Gera um número aleatório de 1 a 6 e te menciona com o resultado'
        );
    }

    // Comando /girar dados
    if (msg.body.toLowerCase() === '/girar dados') {
        const userId = msg.author || msg.from; // msg.author para grupos, msg.from para privado
        const numero = Math.floor(Math.random() * 6) + 1;
        const mentions = [userId];
        await client.sendMessage(
            chat.id._serialized,
            `🎲 @${userId.split('@')[0]}, você tirou o número *${numero}*!`,
            { mentions }
        );
    }
});

client.initialize();