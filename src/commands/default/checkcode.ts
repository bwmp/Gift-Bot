import { Command } from '~/types/objects';
import opts from '~/options/checkcode'
import prisma from '~/functions/database';
export const checkcode: Command = {
  description: "checks the user associated with a code",
  permissions: ['Administrator'],
  options: opts,
  ephemeral: true,
  execute: async function (interaction, args) {
    const code = args.getString('code', true);

    const codeExists = await prisma.usedCodes.findFirst({
      where: {
        code,
      }
    });

    if (!codeExists) {
      interaction.editReply({ content: "Code not found" });
      return;
    }

    interaction.editReply({ content: `Code found.\n
    User: <@${codeExists.userId}> (${codeExists.userId})\n
    Product: ${codeExists.product}\n
    Code: ${codeExists.code}
    ` });

  }
}