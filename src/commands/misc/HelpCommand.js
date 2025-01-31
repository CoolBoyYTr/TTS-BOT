const { Command } = require('@greencoast/discord.js-extended');
const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED } = require('../../common/constants');

class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['h'],
      description: 'Displays help notifications with all available commands.',
      emoji: ':question:',
      group: 'misc',
      guildOnly: true
    });
  }

  prepareFields() {
    return this.client.registry.groups.map((group) => {
      const listOfCommands = group.commands.reduce((text, command) => {
        return text.concat(`${command.emoji} **${this.client.prefix}${command.name}** - ${command.description}\n`);
      }, '');

      return { title: group.name, text: listOfCommands };
    });
  }

  run(message) {
    const fields = this.prepareFields();
    const embed = new MessageEmbed()
      .setTitle('Text-to-voice help notifications')
      .setColor(MESSAGE_EMBED.color)
      .setThumbnail(MESSAGE_EMBED.helpThumbnail);

    for (const key in fields) {
      const field = fields[key];
      embed.addField(field.title, field.text);
    }

    embed.addField('Detect an error?', 'This bot can still have an error, so in case you find an error, please report it in this bot[**GitHub Issues Page**](${MESSAGE_EMBED.helpURL}).`);

    return message.channel.send(embed);
  }
}

module.exports = HelpCommand;
