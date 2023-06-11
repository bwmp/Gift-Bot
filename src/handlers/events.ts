import { Client } from 'discord.js';
import { readdirSync } from 'fs';

export default (client: Client) => {
  const eventFolders = readdirSync('./src/events/');
  let jsFiles = [];
  let amount = 0;
  for (const event of eventFolders) {
    jsFiles = readdirSync(`./src/events/${event}`).filter(subfile => subfile.endsWith('.ts'));
    amount += jsFiles.length;
    for (const file of jsFiles) {
      const js = require(`../events/${event}/${file}`).default ?? require(`../events/${event}/${file}`);
      client.on(event, js.bind(null, client));
      delete require.cache[require.resolve(`../events/${event}/${file}`)];
    }
  }
  logger.info(`${amount} event listeners loaded`);
};