import { Command } from '~/types/objects';

export const ping: Command = {
	description: "Pong!",
	execute: function (interaction, args) {
		interaction.editReply({ content: "Pong!" })
	}
}