console.log("Ativando..")
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require("./config.js");
const cors = require('chalk');
var prefix = config.prefix
const fs = require('fs')

bot.on('ready', () =>{
  console.log(`Estou ativado! <${bot.user.username}>`);
  bot.user.setActivity("músicas sad 😰", {type: "LISTENING"});
});
bot.commands = new Discord.Collection();
fs.readdir("./comandos", (err, files) => {
  if(err) console.error(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0) {
    console.log (cors.bgRed("@Nenhum comando carregado"));
    return;
  }
  console.log(cors.bgRed(`@Carregado ${jsfiles.length} comando(s)!`));
  jsfiles.forEach((f, i) => {
    let props = require(`./comandos/${f}`);
    bot.commands.set(props.help.name, props)
  });
});

bot.on("message", async(message) =>{
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let args = message.content.split(" ").slice(1).join(" ");
  let command = message.content.split(" ")[0];
  if(!command.startsWith(prefix)) return;

let cmd = bot.commands.get(command.slice(prefix.length));
if(cmd)
cmd.run(bot, message, args);
});


bot.on('guildMemberAdd', member =>{
  let channel = member.guild.channels.find('name', '👉-entrou-saiu');
      if (!channel) return;
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription(`:heavy_check_mark: Olá! Seja bem-vindo ao **PapoSad**, ${member}.`)

      channel.sendEmbed(embed);
});

bot.on('guildMemberAdd', member => {

    console.log(`${member}`, "entrou!" + `${member.guild.name}`)

});

bot.on('guildMemberAdd', member =>{
  let embed = new Discord.RichEmbed()
  .setColor('#2fd12c')
  .setDescription(`Olá. Seja **bem-vindo(a)** ao Discord do PapoSad!
:white_small_square: Antes de interagir, leia as **regras**.
:white_small_square: Precisa de ajuda? Contate um de nossos Suporter's!`)
  .setTimestamp()

  member.sendEmbed(embed);
});

bot.on('guildMemberRemove', member =>{
  let channel = member.guild.channels.find('name', '👉-entrou-saiu');
  let memberavatar = member.user.avatarURL
      if (!channel) return;
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription(`:x: Vixi, **${member}** saiu, espero que tenha se arrependido. ;)`)

      channel.sendEmbed(embed);
});

bot.login(process.env.BOT_TOKEN);
