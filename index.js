const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const { token, clientId, guildId, channelId, reviveCooldown } = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`Command loaded: ${command.data.name}`);
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('Chatting with everyone!', { type: 'WATCHING' });

    const commands = client.commands.map(command => command.data);
    try {
        await client.application.commands.set(commands, guildId);
        console.log('Slash commands registered successfully!');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
    startChatReviewer();
});

let countdownTimer;
let countdownValue;
let countdownChannel;

function startChatReviewer() {
    client.on('messageCreate', (message) => {
        if (message.author.bot || message.channel.id !== channelId) return;
        resetCountdownTimer(message.channel);
    });
}

function resetCountdownTimer(channel) {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    
    countdownValue = reviveCooldown; 
    countdownChannel = channel;

    
    countdownTimer = setInterval(() => {
        countdownValue--;
        if (countdownValue <= 0) {
            clearInterval(countdownTimer);
            countdownChannel.send("Hey everyone! Let's keep the conversation going!");
        }
    }, 1000);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(token).catch(console.error);