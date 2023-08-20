// Required libraries / Bibliothèques requises
const { Client, Intents } = require('discord.js');
const client = new Client({ 
    intents: [ 
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES 
    ] 
});

// Default token and save channel ID / Token et ID du channel de sauvegarde par défaut
let token = 'YOUR_DEFAULT_TOKEN';
let saveChannelID = 'YOUR_DEFAULT_SAVE_CHANNEL_ID';

// Default language for responses / Langue par défaut pour les réponses
let language = 'en'; // 'fr' for French, 'en' for English, 'es' for Spanish

// Retrieve command line arguments (token, save channel ID, and language) / Récupérer les arguments en ligne de commande (token, ID du channel de sauvegarde, et langue)
const args = process.argv.slice(2);

// Use the provided token if available / Utiliser le token fourni s'il est disponible
if (args.length >= 1) {
    token = args[0];
}

// Use the provided save channel ID if available / Utiliser l'ID du channel de sauvegarde fourni s'il est disponible
if (args.length >= 2) {
    saveChannelID = args[1];
}

// Use the provided language if available / Utiliser la langue fournie si disponible
if (args.length >= 3) {
    language = args[2].toLowerCase();
}

// Function to get the response message based on the selected language / Fonction pour obtenir le message de réponse en fonction de la langue sélectionnée
function getResponseMessage(language) {
    // Define the response messages in different languages / Définir les messages de réponse dans différentes langues
    const responseMessages = {
        fr: 'Message sauvegardé avec succès !',
        en: 'Message saved successfully!',
        es: '¡Mensaje guardado exitosamente!'
    };

    // Return the response message in the selected language / Retourner le message de réponse dans la langue sélectionnée
    return responseMessages[language] || responseMessages['en']; // Default to English if the selected language is not supported / Par défaut, utiliser l'anglais si la langue sélectionnée n'est pas prise en charge
}

// Function called when the bot is ready / Fonction appelée lorsque le bot est prêt
client.once('ready', () => {
    console.log('Bot is ready!');
});

// Function called when a message is sent on the server / Fonction appelée lorsqu'un message est envoyé sur le serveur
client.on('messageCreate', async (message) => {
    // Check if the message starts with "/savemsg" / Vérifier si le message commence par "/savemsg"
    if (message.content.startsWith('/savemsg')) {
        // Check if the message is a reply / Vérifier si le message est une réponse
        if (!message.reference) {
            return message.reply(getResponseMessage(language));
        }

        // Retrieve the replied message / Récupérer le message auquel on répond
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);

        // Check if the replied message exists / Vérifier si le message auquel on répond existe
        if (!repliedMessage) {
            return message.reply('The replied message was not found.');
        }

        // Retrieve the author's name and content of the replied message / Récupérer le nom de l'auteur et le contenu du message auquel on répond
        const authorName = repliedMessage.author.username;
        const content = repliedMessage.content;

        // Retrieve the save channel / Récupérer le channel de sauvegarde
        const saveChannel = client.channels.cache.get(saveChannelID);

        // Check if the save channel exists / Vérifier si le channel de sauvegarde existe
        if (!saveChannel) {
            return message.reply('The save channel was not found.');
        }

        // Save the message in the save channel / Sauvegarder le message dans le channel de sauvegarde
        saveChannel.send(`Author: ${authorName}\nContent: ${content}`);
        message.reply(getResponseMessage(language));

        // Display the saved message in the console / Afficher le message sauvegardé dans la console
        console.log(`Message saved: Author: ${authorName}, Content: ${content}`);
    }
});

// Bot login with the token / Connexion du bot avec le token
client.login(token);

// INSTRUCTIONS:
// ------------
// How to Use:
// 1. Install required libraries using 'npm install discord.js' command.
// 2. Create a new Discord bot application on the Discord Developer Portal: https://discord.com/developers/applications
// 3. Go to the 'Bot' tab and click 'Add Bot' to get the bot token.
// 4. Invite the bot to your server using the following URL:
//    https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot
//    Replace 'YOUR_CLIENT_ID' with your bot's Client ID from the Developer Portal.
// 5. Run this script with the bot token, the ID of the channel where messages will be saved, and the language code as command line arguments.
//    For example: 'node bot.js YOUR_BOT_TOKEN YOUR_SAVE_CHANNEL_ID fr'
//
// Language Codes:
// - 'fr' for French
// - 'en' for English
// - 'es' for Spanish (Default if the specified language is not supported)
//
// Note: This code was primarily generated with the assistance of ChatGPT, an AI language model by OpenAI. 
//       Comments have been added to provide clear explanations of the code in both French and English.
//       Difficulties encountered during the development process include handling Collections in Discord.js v13,
//       as well as retrieving the last message of a specified author while accounting for potential edge cases.
//       Feedback from the user was used to make improvements to the code.
