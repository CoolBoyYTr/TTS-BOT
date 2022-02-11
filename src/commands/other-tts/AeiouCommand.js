/* eslint-disable max-statements */
const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');
const AeiouProvider = require('../../classes/tts/providers/AeiouProvider');

class AeiouCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aeiou',
      aliases: ['moonbase'],
      description: 'Send a TTS aeiou message (similar to Moonbase Alpha) in your voice channel.',
      emoji: ':robot:',
      group: 'other-tts',
      guildOnly: true
    });
  }

  run(message, args) {
    const { channel } = message.member.voice;
    const { ttsPlayer, name: guildName, voice } = message.guild;
    const connection = voice ? voice.connection : null;

    if (!channel) {
      return message.reply('You need it in a previous voice channel.');
    }

    if (args.length < 1) {
      return message.reply('you need to enter something you want to say..');
    }

    if (connection) {
      if (voice.channel !== channel) {
        return message.reply('You need to be on the same channel as me..');
      }

      return ttsPlayer.say(args.join(' '), AeiouProvider.NAME);
    }

    if (!channel.viewable) {
      return message.reply('I can't see your voice channel..');
    }

    if (!channel.joinable) {
      return message.reply('I can't join your voice channel.');
    }

    if (!channel.speakable) {
      return message.reply('I can't speak in your voice channel..');
    }

    if (channel.full) {
      return message.reply('Your voice channel is full.');
    }

    return channel.join()
      .then(() => {
        logger.info(`Participated ${channel.name} in ${guildName}.`);
        message.channel.send(`Participated ${channel}.`);
        return ttsPlayer.say(args.join(' '), AeiouProvider.NAME);
      });
  }
}

module.exports = AeiouCommand;
