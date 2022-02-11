const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');
const { GoogleProviderError } = require('../../errors');

class LangCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lang',
      description: 'Change the TTS language.',
      emoji: ':map:',
      group: 'google-tts',
      guildOnly: true
    });
  }

  run(message, args) {
    let [newLang] = args;
    const { googleProvider } = message.guild.ttsPlayer;

    if (!newLang) {
      return message.reply(`to set up the TTS language, run: **${this.client.prefix}lang <language code>**
      
      To see a list of available language codes, run: **${this.client.prefix}langs**.
      
      The current language is set to: **${googleProvider.getLang()}**.`);
    }

    newLang = newLang.toString().toLowerCase();

    try {
      const setLang = googleProvider.setLang(newLang);
      logger.info(`Server ${message.guild.name} Changed the language to ${googleProvider.getLang()}.`);
      return message.reply(`The language has been set. **${setLang}**.`);
    } catch (error) {
      if (error instanceof GoogleProviderError) {
        if (error.reason === GoogleProviderError.REASON.invalid) {
          return message.reply(`Invalid language. Enter **${this.client.prefix}langs** to find a list of available languages.`);
        } else if (error.reason === GoogleProviderError.REASON.same) {
          return message.reply(`The language has been set. **${googleProvider.getLang()}**.`);
        }

        throw error;
      }

      throw error;
    }
  }
}

module.exports = LangCommand;
