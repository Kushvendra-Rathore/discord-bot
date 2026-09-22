// Author: Kushvendra Singh Rathore

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

require("dotenv").config();
client.login(process.env.DISCORD_TOKEN);

client.on("messageCreate",(message)=>{
    if(message.author.bot) return;
    message.reply({
        content:"HELLO FROM BOT",
    });
});

