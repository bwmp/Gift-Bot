import { ButtonInteraction, Client, GuildMember, StringSelectMenuInteraction } from "discord.js";

export default async (client: Client, interaction: ButtonInteraction | StringSelectMenuInteraction) => {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
    if (!interaction.guild) return;

    const id = interaction instanceof StringSelectMenuInteraction ? interaction.values[0] : interaction.customId;

    const isReactRole = id.startsWith("reactrole:");
    if (!isReactRole) return;
    const roleID = id.split(":")[1];
    const member = interaction.member as GuildMember;
    if (!member) return;

    const role = interaction.guild.roles.cache.get(roleID);
    if (!role) return;

    const roles = member.roles;
    if (roles.cache.has(roleID)) {
        roles.remove(role);
        interaction.reply({ content: `Removed ${role.name}`, ephemeral: true });
    } else {
        roles.add(role);
        interaction.reply({ content: `Added ${role.name}`, ephemeral: true });
    }
}