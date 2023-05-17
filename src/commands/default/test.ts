import { Command } from '~/types/Objects';

export const test: Command = {
	description: "test command!",
    options: require('~/options/test').default,
	execute: function (interaction, args, client) {
		throw new Error('Function not implemented.');
	}
}