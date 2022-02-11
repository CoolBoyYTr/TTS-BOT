const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');

class StopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      aliases: ['leave'],
      description: 'Stop the TTS bot and leave the voice channel.',
      emoji: ':x:',
      group: 'all-tts',
      guildOnly: true
    });
  }

  run(message) {
    const { ttsPlayer, voice, name: guildName } = message.guild;
    const connection = voice ? voice.connection : null;
    const channel = voice ? voice.channel : null;
    const { channel: memberChannel } = message.member.voice;

    if (!connection) {
      return message.reply("I'm not in the voice channel.");
    }

    if (!memberChannel || channel !== memberChannel) {
      return message.reply('you need to be in the same voice channel as me to use this command.');
    }

    ttsPlayer.stop();
    logger.info(`Successfully left the voice channel ${channel.name} from the server ${guildName}`);
    return message.channel.send(`Successfully left the voice channel ${channel}.`);
  }
}

module.exports = StopCommand;
