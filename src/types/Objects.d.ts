import { SlashCommandBuilder, PermissionsBitField, Message, Client, CommandInteraction, ButtonInteraction, ModalSubmitInteraction, ContextMenuCommandInteraction, GuildMember, StringSelectMenuInteraction, AutocompleteInteraction, CommandInteractionOptionResolver, CacheType } from 'discord.js';

export class Command {
  name?: string;
  description: string;
  category?: string;
  usage?: string;
  guildOnly?: boolean;
  permissions?: (keyof typeof PermissionsBitField.Flags)[];
  channelPermissions?: (keyof typeof PermissionsBitField.Flags)[];
  botPerms?: (keyof typeof PermissionsBitField.Flags)[];
  botChannelPerms?: (keyof typeof PermissionsBitField.Flags)[];
  cooldown?: number;
  ephemeral?: boolean;
  noDefer?: boolean;
  options?: (cmd: SlashCommandBuilder) => void | Promise<void>;
  autoComplete?: (client: Client, interaction: AutocompleteInteraction) => void | Promise<void>;
  execute: (interaction: CommandInteraction, args: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">) => void | Promise<void>;
}

export class Button {
  name?: string;
  deferReply?: boolean;
  noDefer?: boolean;
  ephemeral?: boolean;
  execute: (interaction: ButtonInteraction | StringSelectMenuInteraction, args: string[]) => void | Promise<void>;
}