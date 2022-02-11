const { Command } = require('@greencoast/discord.js-extended');
const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED } = require('../../common/constants');
const { splitContentForEmbedFields } = require('../../common/utils');
const languages = require('../../../data/languages.json');

class LangsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'langs',
      description: 'Displays a list of supported languages.',
      emoji: ':page_facing_up:',
      group: 'google-tts',
      guildOnly: true
    });

    this.langsEmbed = this.createEmbed();
  }

  createEmbed() {
    const embed = new MessageEmbed()
      .setTitle('List of supported languages:')
      .setColor(MESSAGE_EMBED.color)
      .setDescription(`This is the full list of all the languages supported by this TTS bot. 
    
      To change the language, use **${this.client.prefix}lang <language code>**.`)
      .setThumbnail(MESSAGE_EMBED.langThumbnail)
      .setURL(MESSAGE_EMBED.langURL);

    const content = this.sortedLanguageKeys().map((key) => {
      const cur = languages[key];
      return `${cur.emoji} ${cur.name} - '**${this.client.prefix}lang ${key}**'\n`;
    });
    const splitContent = splitContentForEmbedFields(content);

    splitContent.forEach((field, index) => {
      embed.addField(`Page ${index + 1}:`, field);
    });

    return embed;
  }

  sortedLanguageKeys() {
    return Object.keys(languages).sort((a, b) => {
      return languages[a].name.localeCompare(languages[b].name);
    });
  }

  run(message) {
    return message.channel.send(this.langsEmbed);
  }
}

module.exports = LangsCommand;
