import { AttachmentBuilder, Client, GuildMember, TextChannel } from "discord.js";
import Canvas from "@napi-rs/canvas";


Canvas.GlobalFonts.registerFromPath('./src/assets/fonts/NexaScript-Trial-Regular.ttf', 'NexaScript');

const applyText = (canvas: Canvas.Canvas, text: string) => {
  const context = canvas.getContext('2d');

  let fontSize = 70;

  do {
    context.font = `${fontSize -= 10}px NexaScript`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};

export default async (client: Client, member: GuildMember) => {
  const channel = member.guild.channels.cache.get(process.env.GOODBYE_CHANNEL as string) as TextChannel;

  if (!channel) return;

  const canvas = Canvas.createCanvas(700, 315);
  const ctx = canvas.getContext("2d");

  const text = member.user.username

  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cat = await Canvas.loadImage(
    "./src/assets/images/cat.png"
  );

  ctx.drawImage(cat, 500, canvas.height - 200, 200, 200);
  //flip cat image horizontally and put it on the left side
  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(cat, -100, canvas.height - 100, 100, 100);
  ctx.restore();

  ctx.shadowColor = "#7c4b8b";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;

  ctx.font = "45px NexaScript";
  ctx.fillStyle = "#f0ccfb";
  ctx.fillText("Goodbye", canvas.width / 2.75, canvas.height / 2.25);
  ctx.font = applyText(canvas, text);
  ctx.fillStyle = "#f0ccfb";
  ctx.fillText(text, canvas.width / 2.75, canvas.height / 1.5);

  ctx.shadowColor = "transparent";

  const pfp = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "png", size: 512 }));

  ctx.beginPath();
  ctx.arc(125, canvas.height / 2, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(pfp, 25, canvas.height / 2 - 100, 200, 200);

  const attachment = new AttachmentBuilder(await canvas.encode("webp"), { name: "welcome.png" });

  channel.send({ files: [attachment] });

};