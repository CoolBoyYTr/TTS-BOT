const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');
const { GoogleProviderError } = require('../../errors');

class SpeedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'speed',
      description: 'Change the TTS speaking speed (must be **normal** for normal speed or **slow** for slow speed)).',
      emoji: ':fast_forward:',
      group: 'google-tts',
      guildOnly: true
    });
  }

  run(message, args) {
    const [newSpeed] = args;
    const { googleProvider } = message.guild.ttsPlayer;

    if (!newSpeed) {
      return message.reply(`to set the TTS speed, type: **${this.client.prefix}speed <speed>** and replace *<ss>* with either *normal* or *slow*.');
    }

    try {
      const setSpeed = googleProvider.setSpeed(newSpeed);
      logger.info(`Server ${message.guild.name} Changed the speed to ${setSpeed}.`);
      return message.reply(`The speed of speaking has been set to: **${setSpeed}**`);
    } catch (error) {
      if (error instanceof GoogleProviderError) {
        if (error.reason === GoogleProviderError.REASON.invalid) {
          return message.reply('the speed is not valid, it must be *normal* or *slow*.');
        }

        throw error;
      }

      throw error;
    }
  }
}

module.exports = SpeedCommand;
