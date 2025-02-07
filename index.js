require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const START_DATE = new Date(process.env.START_DATE);

client.once('ready', () => {
    console.log(`✅ Bot is online:)`);

    cron.schedule('15 7 * * *', async () => {  
        const today = new Date();
        const diffTime = today - START_DATE;
        const dayCount = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const messages = [
            process.env.MESSAGE_1.replace("{dayCount}", dayCount),
            process.env.MESSAGE_2,
            process.env.MESSAGE_3
        ];

        try {
            const channel = await client.channels.fetch(CHANNEL_ID); 

            if (channel) {

                for (const msg of messages) {
                    await channel.send(msg);
                }

                console.log(`📢 メッセージを送信しました: ${dayCount}日目`);
            } else {
                console.log("⚠️ チャンネルが見つかりません！");
            }
        } catch (error) {
            console.error("😔 チャンネル取得エラー:", error);
        }
    });

    console.log("👍 Setting done;)");
});

client.login(TOKEN);