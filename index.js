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

bot.on('message', message => {

  // Variables - Variables make it easy to call things, since it requires less typing.
  let msg = message.content.toUpperCase(); // This variable takes the message, and turns it all into uppercase so it isn't case sensitive.
  let sender = message.author; // This variable takes the message, and finds who the author is.
  let cont = message.content.slice(prefix.length).split(" "); // This variable slices off the prefix, then puts the rest in an array based off the spaces
  let args = cont.slice(1); // This slices off the command in cont, only leaving the arguments.

  // Commands


  // Purge
  if (msg.startsWith(prefix + 'PURGE')) { // This time we have to use startsWith, since we will be adding a number to the end of the command.
      // We have to wrap this in an async since awaits only work in them.
      async function purge() {
          message.delete(); // Let's delete the command message, so it doesn't interfere with the messages we are going to delete.

          // Now, we want to check if the user has the `bot-commander` role, you can change this to whatever you want.
          if (!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES")) return null; // This checks to see if they DONT have it, the "!" inverts the true/false

          // We want to check if the argument is a number
          if (isNaN(args[0])) {
              // Sends a message to the channel.
              message.channel.send('Insira o número de mensagens que deseja remover. \n Exemplo: ' + prefix + 'limpar <número>.'); //\n means new line.
              // Cancels out of the script, so the rest doesn't run.
              return;
          }

          const fetched = await message.channel.fetchMessages({limit: args[0]}); // This grabs the last number(args) of messages in the channel.
          console.log(fetched.size + ' mensagens deletadas.'); // Lets post into console how many messages we are deleting

          // Deleting the messages
          message.channel.bulkDelete(fetched)
              .catch(error => message.channel.send(`Erro: ${error}`)); // If it finds an error, it posts it into the channel.

      }

      // We want to make sure we call the function whenever the purge command is run.
      purge(); // Make sure this is inside the if(msg.startsWith)

  }

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
