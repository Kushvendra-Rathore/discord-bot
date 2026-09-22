// Author: Kushvendra Singh Rathore

const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

client.login(process.env.DISCORD_TOKEN);

client.on("messageCreate", async (message)=>{
    if(message.author.bot) return;  // due to this "if" check, it wont reply its own message
    
    if(message.content.startsWith("!ask")){
        const question = message.content.split("!ask")[1].trim();
        
        if (!question) {
            return message.reply({ content: "Please ask a question! Usage: !ask <your question>" });
        }

        try {
            await message.channel.sendTyping();
            
            const systemPrompt = "\n\n(IMPORTANT: Format your response for Discord. Do NOT use LaTeX, MathJax, or $ symbols for math. Use plain text like O(N^2).)";
            const result = await model.generateContent(question + systemPrompt);
            const response = result.response.text();
            
            if (response.length > 2000) {
                const chunks = response.match(/[\s\S]{1,1990}/g) || [];
                for (const chunk of chunks) {
                    await message.channel.send({ content: chunk });
                }
                return;
            }

            return message.reply({ content: response });
        } catch (error) {
            console.error("Gemini API Error:", error);
            if (error.status === 503) {
                return message.reply({ content: "Whoops! The AI is currently experiencing high demand. Please wait a few seconds and try asking again!" });
            }
            if (error.status === 429) {
                return message.reply({ content: "Whoops! You are asking questions too fast and hit the free tier rate limit. Please wait a minute before asking again." });
            }
            
            // Print the actual error message to discord so we can see what's wrong!
            return message.reply({ content: `Sorry, an error occurred: **${error.message || "Unknown error"}**` });
        }
    }

    if(message.content.startsWith("create")){
        const url= message.content.split("create")[1];
        return message.reply({
            content: "Generate short url for "+url,
        });
    }
});

client.on("interactionCreate",(interaction)=>{
    console.log(interaction);
    interaction.reply("Pong!!");
});