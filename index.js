/*const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000)*/

if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const Discord = require('discord.js');
const client = new Discord.Client();
const bot = new Discord.Client();
const {RichEmbed} = require('discord.js');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const chalk = require('chalk');
const fs = require('fs');
const { stripIndents } = require('common-tags');
const moment = require('moment');
require('./util/eventLoader')(client);
const db = require('quick.db');
const snekfetch = require('snekfetch');

client.config = require("./config.js");
require("./modules/functions.js")(client);

client.ayar = db;

client.ayarlar = {
        "official_sahip": ["441169716547944448", "441169716547944448"],
        "sahip": [],
        "yardimcilar": [''],
        "isim": "KONYA BOT",
        "botD": "https://discordapp.com/oauth2/authorize?client_id=559720149175894038&scope=bot&permissions=2146958847",
        "webS": "https://konyabott.glitch.me",
        "web": "https://konyabott.glitch.me",
        "versiyon": "0.0.1",
        "prefix": "k!",
        "radyo": ["Fenomen FM", "Kral FM", "Power Türk FM", "Joy", "Metro"],
        "secenek": ["tr", "en"],
        "yenilik": [
          "toplu-rol-ver",
          "toplu-rol-al"
        ]
};

const ayarlar = client.ayarlar;

client.tr = require('./tr.js');
client.en = require('./en.js');

//var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${chalk.yellow(`»`)} ${message}`);
};




client.on('guildMemberAdd', async (member, guild) => {
let tag = await db.fetch(`tagB_${member.guild.id}`)
  if (tag == null) tag = ``
member.setNickname(`${tag} ${member.user.username}`)
    })




client.on("ready", async () => {
  
  client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);
  
  require("./modules/dashboard.js")(client); 
  
  console.log(`${chalk.green(client.user.username)}${chalk.red(",")} ${chalk.blue(client.guilds.size)} ${chalk.yellow("Sunucu'ya")} ${chalk.red("ve")} ${chalk.blue(client.users.size.toLocaleString())} ${chalk.yellow("Kullanıcı'ya")} ${chalk.red("hizmet veriyor!")}`)
  client.user.setStatus("dnd");
  client.user.setActivity(`${client.ayarlar.prefix}yardım | ${client.ayarlar.web}`, { type: 'WATCHING' });
  
})

client.on("message", async message => {
  
  let client = message.client;
  
  const ayarlar = client.ayarlar
  
  //if (!client.users.get(client.user.id).hasPermission("SEND_MESSAGES")) return message.reply(`Yeterli izinlere sahip değilim! \n**İhtiyacım Olan Yetki:** \n\`Mesaj Gönder\``)

  if (!message.guild) return;

  let prefix;
  
if (db.has(`prefix_${message.guild.id}`) === true) {
  prefix = db.fetch(`prefix_${message.guild.id}`)
}
  
if (db.has(`prefix_${message.guild.id}`) === false) {
  prefix = client.ayarlar.prefix
}
  
   const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const p = String(message.content.match(prefixMention));
  
  if (message.author.bot) return;
  if (!message.content.startsWith(p)) return;
  const args = message.content.slice(p.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
   } else
    if (client.english.has(command)) {
    cmd = client.english.get(command);
    }
  
  var dill = 'tr'
    if(db.has(`dil_${message.guild.id}`) === true) {
        var dill = 'en'
    }
    const dil = client[dill]
  
  db.add(`sunucuxp_${message.guild.id}`, 1)
  
  var y = db.fetch(`sunucuxp_${message.guild.id}`);
  
  if (y === 50) {
    db.set(`premium_${message.guild.id}`, "aktif")
    let e = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setAuthor(`Tebrikler ${message.guild.name}!`)
    .setDescription(`Sunucu Puanı başarıyla **${y}** puana ulaştı! Premium mod aktif edildi!`)
    message.channel.send(e)
    message.guild.owner.send(e)
  }
  
  if (cmd) {
    
    if (db.has(`karalist_${message.author.id}`) === true) {
    let embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription("Sen botun komutlarını kullanamazsın! Çünkü botun kara listesindesin!")
    message.channel.send({embed: embed})
    message.react("😡")
    return
  };
    
    //if (ayarlar.sahip.includes(message.author.id)) return;
    
    if (cmd.conf.enabled === false) {
      if (!ayarlar.sahip.includes(message.author.id) && !ayarlar.official_sahip.includes(message.author.id)) {
        const embed = new Discord.RichEmbed()
					.setDescription(`Bu komut şuanda sunucularda kullanıma kapalıdır! (Yapım aşamasındadır)`)
					.setColor("RANDOM")
				message.channel.send({embed})
				return
      }
    }
    
    if (cmd.conf.bakim === false) {
      //if (!ayarlar.sahip.includes(message.author.id) && !ayarlar.official_sahip.includes(message.author.id)) {
        const embed = new Discord.RichEmbed()
					.setDescription(`Bu komut bakımdadır.`)
					.setColor("RANDOM")
				message.channel.send({embed})
				/*return
      }*/
    }
    
    if (cmd.conf.permLevel === 1) {
			if (!message.member.hasPermission("MANAGE_MESSAGES") & !ayarlar.official_sahip.includes(message.author.id)) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Bu komutu kullanabilmek için Mesajları Yönet iznine sahip olmalısın!`)
          .setColor("RANDOM")
				message.channel.send({embed})
				return
			}
		}
		if (cmd.conf.permLevel === 2) {
			if (!message.member.hasPermission("KICK_MEMBERS") & !ayarlar.official_sahip.includes(message.author.id)) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Bu komutu kullanabilmek için Üyeleri At iznine sahip olmalısın!`)
					.setColor("RANDOM")
				message.channel.send({embed})
				return
			}
		}
    if (cmd.conf.permLevel === 3) {
			if (!message.member.hasPermission("BAN_MEMBERS") & !ayarlar.official_sahip.includes(message.author.id)) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Bu komutu kullanabilmek için Üyeleri Yasakla iznine sahip olmalısın!`)
					.setColor("RANDOM")
				message.channel.send({embed})
				return
			}
		}
		if (cmd.conf.permLevel === 4) {
			if (!message.member.hasPermission("ADMINISTRATOR") & !ayarlar.official_sahip.includes(message.author.id)) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Bu komutu kullanabilmek için Yönetici iznine sahip olmalısın!`)
					.setColor("RANDOM")
				message.channel.send({embed})
				return
			}
		}
		if (cmd.conf.permLevel === 5) {
			if (!ayarlar.sahip.includes(message.author.id) && !ayarlar.official_sahip.includes(message.author.id)) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Bu komutu sadece Bot Sahibi kullanabilir!`)
					.setColor("RANDOM")
				message.channel.send({embed})
				return
			}
		}
    
    cmd.run(client, message, args, dil, dill);
    
  }
  
});



client.on("message", async message => {
  
  if (!message.guild) return;
  
let prefix = await db.fetch(`prefix_${message.guild.id}`) || "k!";
  
  if (message.author.bot) return;
  

  
  if (message.content === `<@${client.user.id}>`) {
    
    message.channel.send(`• Bu sunucuya ait ön-ek/prefix: \`${prefix}\` \n• Bu sunucuya ait yardım komutu: \`${prefix}yardım\` \n• Ön-ek/Prefix değiştirilse bile komutlar etiket ile çalışır. \nÖrnek: \`@${client.user.tag}\`yardım`)
    
  }
  
  if (message.content === `<@${client.user.id}> ${message.content}`) {
    
    message.channel.send(`• Bu sunucuya ait ön-ek/prefix: \`${prefix}\` \n• Bu sunucuya ait yardım komutu: \`${prefix}yardım\` \n• Ön-ek/Prefix değiştirilse bile komutlar etiket ile çalışır. \nÖrnek: \`@${client.user.tag}\`yardım`)
    
  }
  
});

client.on("guildCreate",guild => {
  const e = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setDescription("Beni Sunucuna Eklediğin İçin Teşekkür Ederim, \n Bir Ayar Komudunu Kapatmak İçin `k!ayarlar kapat` Yazarak Nasıl Kapatacağınızı Görebilirsiniz. \n Ayrıca Komutlarımı görmek için `k!yardım` yazabilirsiniz\n [DESTEK SUNUCUM](https://discord.gg/mK5u79Q) \n [WEB PANELİM](https://konyabott.glitch.me)")
          .setFooter("Bu Mesaj Sadece Size Gönderilmiştir.")
guild.owner.send(e)
})

client.on('messageReactionAdd', async (msgReact, user) => {
      if (user.bot === true) return;
  
     if (msgReact.message.id !== db.fetch(`oylamaM_${msgReact.message.guild.id}`)) return;
  
     if (msgReact.message.id === db.fetch(`oylamaM_${msgReact.message.guild.id}`)) {
  
        if (msgReact.emoji.name === "✅") {
        	
        db.add(`oylamaE_${msgReact.message.guild.id}`, 1)   
              
        }
  
        if (msgReact.emoji.name === "❌") {
          
          db.add(`oylamaH_${msgReact.message.guild.id}`, 1)
        
        }  
       
     }
});

const invites = {};


const wait = require('util').promisify(setTimeout);

client.on('ready', () => {

  wait(1000);


  client.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on('guildMemberAdd', member => {
  
  
 
  member.guild.fetchInvites().then(guildInvites => {
    
    if (db.has(`dKanal_${member.guild.id}`) === false) return
    const channel = db.fetch(`dKanal_${member.guild.id}`).replace("<#", "").replace(">", "")
    
    const ei = invites[member.guild.id];
  
    invites[member.guild.id] = guildInvites;
 
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);

    const davetçi = client.users.get(invite.inviter.id);
 
    
   const embed = new Discord.RichEmbed()
   .setColor('GREEN')
   .setDescription(`**${member.user.tag}** Sunucuya Katıldı, Katıldığı davet linki: **${invite.code}** \n Davet eden kullanıcı: **${davetçi.tag}** \n **${davetçi.tag}** Adlı kullanıcının oluşturduğu **${invite.code}** Adlı davet linkinden gelen kullanıcı sayısı: **${invite.uses}**`)
   member.guild.channels.get(channel).send(embed)
  })
});

client.on("message",async  message => {

  if (!message.guild) return;
  
let prefix = await db.fetch(`prefix_${message.guild.id}`) || "k!";

  //let k;
  if(db.has(`komut_${message.guild.id}`)) {
for(var i = 0; i < db.fetch(`komut_${message.guild.id}`).length; i++) {
  
 var o = Object.keys(db.fetch(`komut_${message.guild.id}`)[i])
 
  if (message.content === prefix+o) {
    
    var a = db.fetch(`komut_${message.guild.id}`)[i][Object.keys(db.fetch(`komut_${message.guild.id}`)[i])]
    
    message.channel.send(a)
  
 }
}
  }
  
});


client.on("message", message => {
  if (!message.guild) return;
    let prefixyeni = db.fetch(`prefix_${message.guild.id}`) || client.ayarlar.prefix;
    let afk_kullanici = message.mentions.users.first() || message.author;
    if(message.content.startsWith(prefixyeni+"afk")) return;
  if (message.author.bot === true) return;
    if(message.content.includes(`<@${afk_kullanici.id}>`))
        if(db.has(`afks_${afk_kullanici.id}`)) {
                message.channel.send(`**${client.users.get(afk_kullanici.id).tag}** adlı kullanıcı şuanda AFK! \n**Sebep:** \n${db.fetch(`afks_${afk_kullanici.id}`)}`)
        }
  
        if(db.has(`afks_${message.author.id}`)) {
                message.reply("başarıyla AFK modundan çıktın!")
            db.delete(`afks_${message.author.id}`)
        }
});

client.on('guildCreate', async guild => {
   var konum = ''
        if(guild.region === "russia") {
            var konum = '_Rusya_ :flag_ru:'
        }
        if(guild.region === "us-west") {
            var konum = '_Batı Amerika_ :flag_us: '
        }
        if(guild.region === "us-south") {
            var konum = '_Güney Amerika_ :flag_us: '
        }
        if(guild.region === "us-east") {
            var konum = '_Doğu Amerika_ :flag_us: '
        }
        if(guild.region === "us-central") {
            var konum = '_Amerika_ :flag_us: '
        }
        if(guild.region === "brazil") {
            var konum = '_Brezilya_ :flag_br:'
        }
        if(guild.region === "singapore") {
            var konum = '_Singapur_ :flag_sg:'
        }
        if(guild.region === "sydney") {
            var konum = '_Sidney_ :flag_sh:'
        }
        if(guild.region === "eu-west") {
            var konum = '_Batı Avrupa_ :flag_eu:'
        }
        if(guild.region === "eu-south") {
            var konum = '_Güney Avrupa_ :flag_eu:'
        }
        if(guild.region === "eu-east") {
            var konum = '_Doğu Avrupa_ :flag_eu:'
        }
        if(guild.region === "eu-central") {
            var konum = '_Avrupa_ :flag_eu:'
        }
        if(guild.region === "hongkong") {
            var konum = '_Hong Kong_ :flag_hk: '
        }
        if(guild.region === "japan") {
            var konum = '_Japonya_ :flag_jp:'
        }
        var tarih = ''
        if(moment(guild.createdAt).format('MM') === '01') {
            var tarih = `${moment(guild.createdAt).format('DD')} Ocak ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '02') {
            var tarih = `${moment(guild.createdAt).format('DD')} Şubat ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '03') {
            var tarih = `${moment(guild.createdAt).format('DD')} Mart ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '04') {
            var tarih = `${moment(guild.createdAt).format('DD')} Nisan ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '05') {
            var tarih = `${moment(guild.createdAt).format('DD')} Mayıs ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '06') {
            var tarih = `${moment(guild.createdAt).format('DD')} Haziran ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '07') {
            var tarih = `${moment(guild.createdAt).format('DD')} Temmuz ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '08') {
            var tarih = `${moment(guild.createdAt).format('DD')} Ağustos ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '09') {
            var tarih = `${moment(guild.createdAt).format('DD')} Eylül ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '10') {
            var tarih = `${moment(guild.createdAt).format('DD')} Ekim ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '11') {
            var tarih = `${moment(guild.createdAt).format('DD')} Kasım ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '12') {
            var tarih = `${moment(guild.createdAt).format('DD')} Aralık ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
  
  var guildhook = new Discord.WebhookClient("558210390782377995", "2U3PKeQQNSraOfzxZ0yjqWXZd-WufsTNzN4xZEtsE1YC4RaeOZzB7NH0-41TUInrme9n")
  const server = new RichEmbed()
  .setColor('0x36393F')
  .setThumbnail(guild.iconURL || guild.defaultİconURL)
  .setTitle(`${guild.name} Adlı Sunucuya Eklendim!`, guild.iconURL || guild.defaultİconURL)
  .setDescription(`Toplam **${client.guilds.size}** sunucudayım!`)
  .addField(`» Sunucu Bilgileri:`, stripIndents`
   Sunucu Adı: _${guild.name}_
   Sunucu Kimliği/ID: _${guild.id}_
   Sunucunun Kurulduğu Tarih: _${tarih}_
   Sunucunun Konumu: ${konum}
   Sunucu Sahibi: _${guild.owner.user.username}#${guild.owner.user.discriminator}_
   Sunucu Sahibi Kimliği/ID: _${guild.owner.user.id}_
   Sunucudaki Toplam Kullanıcı Sayısı: _${guild.members.size}_
   Sunucudaki İnsan Sayısı: _${guild.members.filter(m => !m.user.bot).size}_
   Sunucudaki Bot Sayısı: _${guild.members.filter(m => m.user.bot).size}_
  `)
  .setFooter(`${client.user.username} | Sunucu İzleyici`, client.user.avatarURL)
  guildhook.send(server);
})

client.on("guildDelete", async guild => {
  var konum = ''
        if(guild.region === "russia") {
            var konum = '_Rusya_ :flag_ru:'
        }
        if(guild.region === "us-west") {
            var konum = '_Batı Amerika_ :flag_us: '
        }
        if(guild.region === "us-south") {
            var konum = '_Güney Amerika_ :flag_us: '
        }
        if(guild.region === "us-east") {
            var konum = '_Doğu Amerika_ :flag_us: '
        }
        if(guild.region === "us-central") {
            var konum = '_Amerika_ :flag_us: '
        }
        if(guild.region === "brazil") {
            var konum = '_Brezilya_ :flag_br:'
        }
        if(guild.region === "singapore") {
            var konum = '_Singapur_ :flag_sg:'
        }
        if(guild.region === "sydney") {
            var konum = '_Sidney_ :flag_sh:'
        }
        if(guild.region === "eu-west") {
            var konum = '_Batı Avrupa_ :flag_eu:'
        }
        if(guild.region === "eu-south") {
            var konum = '_Güney Avrupa_ :flag_eu:'
        }
        if(guild.region === "eu-east") {
            var konum = '_Doğu Avrupa_ :flag_eu:'
        }
        if(guild.region === "eu-central") {
            var konum = '_Avrupa_ :flag_eu:'
        }
        if(guild.region === "hongkong") {
            var konum = '_Hong Kong_ :flag_hk: '
        }
        if(guild.region === "japan") {
            var konum = '_Japonya_ :flag_jp:'
        }
        var tarih = ''
        if(moment(guild.createdAt).format('MM') === '01') {
            var tarih = `${moment(guild.createdAt).format('DD')} Ocak ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '02') {
            var tarih = `${moment(guild.createdAt).format('DD')} Şubat ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '03') {
            var tarih = `${moment(guild.createdAt).format('DD')} Mart ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '04') {
            var tarih = `${moment(guild.createdAt).format('DD')} Nisan ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '05') {
            var tarih = `${moment(guild.createdAt).format('DD')} Mayıs ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '06') {
            var tarih = `${moment(guild.createdAt).format('DD')} Haziran ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '07') {
            var tarih = `${moment(guild.createdAt).format('DD')} Temmuz ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '08') {
            var tarih = `${moment(guild.createdAt).format('DD')} Ağustos ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '09') {
            var tarih = `${moment(guild.createdAt).format('DD')} Eylül ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '10') {
            var tarih = `${moment(guild.createdAt).format('DD')} Ekim ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '11') {
            var tarih = `${moment(guild.createdAt).format('DD')} Kasım ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
        if(moment(guild.createdAt).format('MM') === '12') {
            var tarih = `${moment(guild.createdAt).format('DD')} Aralık ${moment(guild.createdAt).format('YYYY HH:mm:ss')} `
        }
  
  var guildhook = new Discord.WebhookClient("558210390782377995", "2U3PKeQQNSraOfzxZ0yjqWXZd-WufsTNzN4xZEtsE1YC4RaeOZzB7NH0-41TUInrme9n")
  const server = new RichEmbed()
  .setColor('0x36393F')
  .setThumbnail(guild.iconURL || guild.defaultİconURL)
  .setTitle(`${guild.name} Adlı Sunucudan Atıldım!`, guild.iconURL || guild.defaultİconURL)
  .setDescription(`Toplam **${client.guilds.size}** sunucudayım!`)
  .addField(`» Sunucu Bilgileri:`, stripIndents`
   Sunucu Adı: _${guild.name}_
   Sunucu Kimliği/ID: _${guild.id}_
   Sunucunun Kurulduğu Tarih: _${tarih}_
   Sunucunun Konumu: ${konum}
   Sunucu Sahibi: _${guild.owner.user.username}#${guild.owner.user.discriminator}_
   Sunucu Sahibi Kimliği/ID: _${guild.owner.user.id}_
   Sunucudaki Toplam Kullanıcı Sayısı: _${guild.members.size}_
   Sunucudaki İnsan Sayısı: _${guild.members.filter(m => !m.user.bot).size}_
   Sunucudaki Bot Sayısı: _${guild.members.filter(m => m.user.bot).size}_
  `)
  .setFooter(`${client.user.username} | Sunucu İzleyici`, client.user.avatarURL)
  guildhook.send(server);
})

client.on("message", msg => {
  if (!msg.guild) return;
  if (db.has(`küfürE_${msg.guild.id}`) === false) return;
    if (db.has(`küfürE_${msg.guild.id}`) === true) {
    const kufur = new RegExp(/(göt|amk|aq|orospu|oruspu|oç|oc|sik|fuck|yarrak|piç|amq|amcık|çocu|sex|seks|amına|sg|siktir git)/)
  if (kufur.test(msg.content)==true) {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      msg.delete()
       msg.channel.send(`<@${msg.author.id}>`).then(message => message.delete(5000));
        var k = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor("Küfür Engeli!")
        .setDescription(`Bu sunucuda küfürler **${client.user.username}** tarafından engellenmektedir! Küfür etmene izin vermeyeceğim!`)
        msg.channel.send(k).then(message => message.delete(5000));
    }
}
    }

    if (db.has(`capsE_${msg.guild.id}`) === false) return;
    if (db.has(`capsE_${msg.guild.id}`) === true) {
    const kufur = new RegExp(/(E|J|Q|W|R|T|Y|U|I|O|P|Ğ|Ü|A|S|D|F|G|H|K|L|Ş|İ|Z|X|C|V|B|N|M|Ö|Ç)/)
  if (kufur.test(msg.content)==true) {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      msg.delete()
       msg.channel.send(`<@${msg.author.id}>`).then(message => message.delete(5000));
        var k = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor("Büyük Harf Engeli!")
        .setDescription(`Bu sunucuda büyük harfler **${client.user.username}** tarafından engellenmektedir!`)
        msg.channel.send(k).then(message => message.delete(5000));
    }
}
    }


  if (db.has(`linkE_${msg.guild.id}`) === false) return;
    if (db.has(`linkE_${msg.guild.id}`) === true) {
    var regex = new RegExp(/(discord.gg|http|.gg|.com|.net|.org|invite|İnstagram|Facebook|watch|Youtube|youtube|facebook|instagram)/)
    if (regex.test(msg.content)== true) {
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      msg.delete()
       msg.channel.send(`<@${msg.author.id}>`).then(message => message.delete(5000));
        var e = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor("Link Engeli!")
        .setDescription(`Bu sunucuda linkler **${client.user.username}** tarafından engellenmektedir! Link atmana izin vermeyeceğim!`)
        msg.channel.send(e).then(message => message.delete(5000));
    }
}
    }
})





client.on("guildMemberAdd", async member => {
    if (db.has(`sayac_${member.guild.id}`) === false) return
    if (db.has(`sKanal_${member.guild.id}`) === false) return
    const channel = db.fetch(`sKanal_${member.guild.id}`).replace("<#", "").replace(">", "")
    member.guild.channels.get(channel).send(`**${member.user.tag}** Sunucuya katıldı! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.members.size}\` üye kaldı!`)
})

client.on("guildMemberRemove", async member => {
    if (db.has(`sayac_${member.guild.id}`) === false) return
    if (db.has(`sKanal_${member.guild.id}`) === false) return
    const channel = db.fetch(`sKanal_${member.guild.id}`).replace("<#", "").replace(">", "")
    member.guild.channels.get(channel).send(`**${member.user.tag}** Sunucudan ayrıldı! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.members.size}\` üye kaldı!`)
})

client.on("message", async message => {
  
  if (!message.guild) return;
  
    if(db.has(`sayac_${message.guild.id}`) === true) {
        if(db.fetch(`sayac_${message.guild.id}`) <= message.guild.members.size) {
            const embed = new Discord.RichEmbed()
            .setTitle(`Tebrikler ${message.guild.name}!`)
            .setDescription(`Başarıyla \`${db.fetch(`sayac_${message.guild.id}`)}\` kullanıcıya ulaştık! Sayaç sıfırlandı!`)
            .setColor("RANDOM")
            message.channel.send({embed})
            message.guild.owner.send({embed})
            db.delete(`sayac_${message.guild.id}`)
        }
    }
})

//let ot = JSON.parse(fs.readFileSync("./jsonlar/otoR.json", "utf8"));

client.on("guildMemberAdd", member => {
  
  //if (!ot[member.guild.id]) return;
  
  //var rol = member.guild.roles.get(ot[member.guild.id].otoRol);
  if (db.has(`otoR_${member.guild.id}`) === false) return;
  var rol = member.guild.roles.get(db.fetch(`otoR_${member.guild.id}`));
  if (!rol) return;
  
  member.addRole(rol)
  
})

client.on("guildMemberAdd", async member => {
  
  if (!member.guild) return;
  
  let prefix = await db.fetch(`prefix_${member.guild.id}`) || "k!";
  
  if(db.has(`gc_${member.guild.id}`) === false) return;
  
  const hgK = member.guild.channels.get(db.fetch(`gc_${member.guild.id}`).replace("<#", "").replace(">", ""));
  if (!hgK) return;
  
  const giris = db.fetch(`girisM_${member.guild.id}`)
  
    hgK.send(db.has(`girisM_${member.guild.id}`) ? giris.replace('{kullanıcı}', `<@${member.user.id}>`).replace("{user}", `<@${member.user.id}>`) : `<@${member.user.id}> Katıldı! (\`giriş-mesaj-ayarla\` komutu ile mesaj değiştirilebilir.)`);
});

client.on("guildMemberRemove", async member => {
  
  if (!member.guild) return;
  
  let prefix = await db.fetch(`prefix_${member.guild.id}`) || "k!";
  
  if(db.has(`gc_${member.guild.id}`) === false) return;
  
  const hgK = member.guild.channels.get(db.fetch(`gc_${member.guild.id}`).replace("<#", "").replace(">", ""));
  if (!hgK) return;
  
  const cikis = db.fetch(`cikisM_${member.guild.id}`)
  
  hgK.send(db.has(`cikisM_${member.guild.id}`) ? cikis.replace('{kullanıcı}', `**${member.user.username}**`).replace("{user}", `**${member.user.username}**`) : `**${member.user.username}** Ayrıldı! (\`çıkış-mesaj-ayarla\` komutu ile mesaj değiştirilebilir.)`);
});



//ÖNEMLİ
/*client.on('voiceStateUpdate', (oldMember, newMember) => {
  
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  
  if (newMember.voiceChannel.name = "deneme-odası") {
  //if (newMember.channel.name != "deneme-odası") return;
  
  if(oldUserChannel === undefined && newUserChannel !== undefined) {

    console.log(`${newMember.user.username} odaya katıldı!`)
    
  }

  }
})*/
//ÖNEMLİ

client.on('message', async msg => {
  
  if (!msg.guild) return;
  
  let prefix = await db.fetch(`prefix_${msg.guild.id}`) || "k!";
  
  var s = 'tr'
  var r = 'Destek Ekibi'
  var k = 'destek-kanalı'
    if(db.has(`dil_${msg.guild.id}`) === true) {
        var s = 'en'
        var r = 'Support Team'
        var k = 'support-channel'
    }
  const dil = s
  
  let rol = '';
  let kanal = '';
  
  if (db.has(`destekK_${msg.guild.id}`) === true) {
 kanal = msg.guild.channels.get(db.fetch(`destekK_${msg.guild.id}`)).name
  }
  
  if (db.has(`destekK_${msg.guild.id}`) === false) {
  kanal = k
  }
  
  if (db.has(`destekR_${msg.guild.id}`) === true) {
  rol = msg.guild.roles.get(db.fetch(`destekR_${msg.guild.id}`))
  }
  
  if (db.has(`destekR_${msg.guild.id}`) === false) {
  rol = r
  }
  
  const reason = msg.content.split(" ").slice(1).join(" ");
  if (msg.channel.name== kanal) {
     if (msg.author.bot) return;
    /*if (!msg.guild.roles.exists("name", rol)) return msg.reply(client[dil].desteksistem.rolyok.replace("{rol}", r)).then(m2 => {
            m2.delete(5000)});*/
    if (msg.guild.channels.find(c => c.name === `${client[dil].desteksistem.talep}-${msg.author.discriminator}`)) {
      
      msg.author.send(client[dil].desteksistem.aciktalepozel.replace("{kisi}", msg.author.tag).replace("{kanal}", `${msg.guild.channels.get(msg.guild.channels.find(c => c.name === `${client[dil].desteksistem.talep}-${msg.author.discriminator}`).id)}`))
      msg.guild.channels.find(c => c.name === `${client[dil].desteksistem.talep}-${msg.author.discriminator}`).send(client[dil].desteksistem.aciktalep.replace("{kisi}", msg.author.tag).replace("{sebep}", msg.content))
      
      msg.delete()
      return
    }
    if(msg.guild.channels.find(c => c.name === client[dil].desteksistem.kategori)) {
      msg.guild.createChannel(`${client[dil].desteksistem.talep}-${msg.author.discriminator}`, "text").then(c => {
      const category = msg.guild.channels.find(c => c.name === client[dil].desteksistem.kategori)
      c.setParent(category.id)
      let role = msg.guild.roles.find(r => r.name === rol.name);
      let role2 = msg.guild.roles.find(r => r.name === "@everyone");
      c.overwritePermissions(role, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
      c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
      });
      c.overwritePermissions(msg.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });

      const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`${client.user.username} | Destek Sistemi`, client.user.avatarURL)
      .setTitle(`_Merhaba ${msg.author.username}!_`)
      .addField(`» Destek Talebi Hakkında Bilgilendirme «`, `Yetkililerimiz en yakın zamanda burada sorunun ile ilgilenecektir! \nDestek talebini kapatmak için \`${prefix}kapat\` yazabilir, \nSunucudaki tüm Destek Taleplerini kapatmak için ise \`${prefix}talepleri-kapat\` yazabilirsin!`)
      .addField(`» Destek Talebi Sebebi «`, `${msg.content}`, true)
      .addField(`» Destek Talebini Açan Kullanıcı «`, `<@${msg.author.id}>`, true)
      .setFooter(`${msg.guild.name} adlı sunucu ${client.user.username} Destek Sistemi'ni kullanıyor teşekkürler!`, msg.guild.iconURL)
      c.send({ embed: embed });
      c.send(`** @here | 📞Destek Talebi! ** \n**${msg.author.tag}** adlı kullanıcı \`${msg.content}\` sebebi ile Destek Talebi açtı!`)
      msg.delete()
      }).catch(console.error);
    }
  }

  if (msg.channel.name== kanal) {
    if(!msg.guild.channels.find(c => c.name === client[dil].desteksistem.kategori)) {
      msg.guild.createChannel(client[dil].desteksistem.kategori, 'category').then(category => {
      category.setPosition(1)
      let every = msg.guild.roles.find(c => c.name === "@everyone");
      category.overwritePermissions(every, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        READ_MESSAGE_HISTORY: false
      })
      msg.guild.createChannel(`${client[dil].desteksistem.talep}-${msg.author.discriminator}`, "text").then(c => {
      c.setParent(category.id)
      let role = msg.guild.roles.find(c => c.name === rol.name);
      let role2 = msg.guild.roles.find(c => c.name === "@everyone");
      c.overwritePermissions(role, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
      c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
      });
      c.overwritePermissions(msg.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });

      const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .setAuthor(`${client.user.username} | Destek Sistemi`, client.user.avatarURL)
      .setTitle(`_Merhaba ${msg.author.username}!_`)
     .addField(`» Destek Talebi Hakkında Bilgilendirme «`, `Yetkililerimiz en yakın zamanda burada sorunun ile ilgilenecektir! \nDestek talebini kapatmak için \`${prefix}kapat\` yazabilir, \nSunucudaki tüm Destek Taleplerini kapatmak için ise \`${prefix}talepleri-kapat\` yazabilirsin!`)
      .addField(`» Destek Talebi Sebebi «`, `${msg.content}`, true)
      .addField(`» Destek Talebini Açan Kullanıcı «`, `<@${msg.author.id}>`, true)
      .setFooter(`${msg.guild.name} adlı sunucu ${client.user.username} Destek Sistemi'ni kullanıyor teşekkürler!`, msg.guild.iconURL)
      c.send({ embed: embed });
      c.send(`** @here | 📞Destek Talebi! ** \n**${msg.author.tag}** adlı kullanıcı \`${msg.content}\` sebebi ile Destek Talebi açtı!`)
      msg.delete()
      }).catch(console.error);
    })
  }
}
})

client.on('message', async message => {
  
  if (!message.guild) return;
  
  let prefix = await db.fetch(`prefix_${message.guild.id}`) || "k!";
  
  var s = 'tr'
  var r = 'Destek Ekibi'
    if(db.has(`dil_${message.guild.id}`) === true) {
        var s = 'en'
        var r = 'Support Team'
    }
  const dil = s
  
if (message.content.toLowerCase().startsWith(prefix + `kapat`)) {
  if (!message.channel.name.startsWith(`${client[dil].desteksistem.talep}-`)) return message.channel.send(`Bu komut sadece Destek Talebi kanallarında kullanılabilir.`);

  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Destek Talebi Kapatma İşlemi!`)
  .setDescription(`Destek talebini kapatma işlemini onaylamak için, \n10 saniye içinde \`evet\` yazınız.`)
  .setFooter(`${client.user.username} | Destek Sistemi`, client.user.avatarURL)
  message.channel.send({embed})
  .then((m) => {
    message.channel.awaitMessages(response => response.content === 'evet', {
      max: 1,
      time: 10000,
      errors: ['time'],
    })
    .then((collected) => {
        message.channel.delete();
      })
      .catch(() => {
        m.edit('Destek talebi kapatma isteği zaman aşımına uğradı.').then(m2 => {
            m2.delete()
        }, 3000);
      });
  });
  }
  
});

client.on("message", async message => {
  
  if (!message.guild) return;
  
  let prefix = await db.fetch(`prefix_${message.guild.id}`) || "k!";
  
  var s = 'tr'
  var r = 'Destek Ekibi'
    if(db.has(`dil_${message.guild.id}`) === true) {
        var s = 'en'
        var r = 'Support Team'
    }
  const dil = s
  
  if (message.content.toLowerCase().startsWith(`${prefix}talepleri-kapat`)) {
  
  if (!message.guild.channels.get(db.fetch(`destekK_${message.guild.id}`))) return;
  if (!message.guild.roles.get(db.fetch(`destekR_${message.guild.id}`))) return;
  
  if (db.has(`destekK_${message.guild.id}`) === true) {
  var kanal = message.guild.channels.get(db.fetch(`destekK_${message.guild.id}`)).name
  var rol = message.guild.roles.get(db.fetch(`destekR_${message.guild.id}`))
  }
  
  if (db.has(`destekK_${message.guild.id}`) === false) {
  var kanal = client[dil].desteksistem.kanal
  var rol = client[dil].desteksistem.rol
  }
    
  if (!message.channel.name.startsWith(`${client[dil].desteksistem.talep}-`)) return message.channel.send(`Bu komut sadece Destek Talebi kanallarında kullanılabilir.`);
    
  if(message.member.roles.has(rol.toString().replace("<@&", "").toString().replace(">", "")) === false) return message.reply(`Bu komutu sadece ${rol} rolüne sahip kullanıcılar kullanabilir!`);

  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Tüm Destek Talepleri Kapatma İşlemi!`)
  .setDescription(`Tüm Destek taleplerini kapatma işlemini onaylamak için, \n10 saniye içinde \`evet\` yazınız.`)
  .setFooter(`${client.user.username} | Destek Sistemi`, client.user.avatarURL)
  message.channel.send({embed})
  .then((m) => {
    message.channel.awaitMessages(response => response.content === 'evet', {
      max: 1,
      time: 10000,
      errors: ['time'],
    })
    .then((collected) => {
   try {
    message.guild.channels.filter(c => c.name.startsWith('yardım-')).forEach(async (kanal, id) => {
     kanal.delete()
  });
  } catch(e){
      //console.log(e.stack);
  }
    })
      .catch(() => {
        m.edit('Tüm Destek taleblerini kapatma isteği zaman aşımına uğradı.').then(m2 => {
            m2.delete()
        }, 3000);
      });
  });
  }
  
});

//log sistemi

//let logA = JSON.parse(fs.readFileSync("./jsonlar/log.json", "utf8"));

client.on("guildMemberAdd", member => {
  
  //if (member.author.bot) return;
  
 // if (!logA[member.guild.id]) return;
  
  var user = member.user;
  var tarih = ''
			if(moment(user.createdAt).format('MM') === '01') {
				var tarih = `${moment(user.createdAt).format('DD')} Ocak ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '02') {
				var tarih = `${moment(user.createdAt).format('DD')} Şubat ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '03') {
				var tarih = `${moment(user.createdAt).format('DD')} Mart ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '04') {
				var tarih = `${moment(user.createdAt).format('DD')} Nisan ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '05') {
				var tarih = `${moment(user.createdAt).format('DD')} Mayıs ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '06') {
				var tarih = `${moment(user.createdAt).format('DD')} Haziran ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '07') {
				var tarih = `${moment(user.createdAt).format('DD')} Temmuz ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '08') {
				var tarih = `${moment(user.createdAt).format('DD')} Ağustos ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '09') {
				var tarih = `${moment(user.createdAt).format('DD')} Eylül ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '10') {
				var tarih = `${moment(user.createdAt).format('DD')} Ekim ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '11') {
				var tarih = `${moment(user.createdAt).format('DD')} Kasım ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '12') {
				var tarih = `${moment(user.createdAt).format('DD')} Aralık ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
  
  var tarih2 = ''
			if(moment(user.joinedAt).format('MM') === '01') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Ocak ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '02') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Şubat ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '03') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Mart ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '04') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Nisan ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '05') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Mayıs ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '06') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Haziran ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '07') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Temmuz ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '08') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Ağustos ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '09') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Eylül ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '10') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Ekim ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '11') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Kasım ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '12') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Aralık ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
  
  //var kanal = member.guild.channels.get(logA[member.guild.id].log);
  
  if (db.has(`log_${member.guild.id}`) === false) return;
  
  var kanal = member.guild.channels.get(db.fetch(`log_${member.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Sunucuya Bir Kullanıcı Katıldı!`, member.user.avatarURL)
  .addField("Kullanıcı Tag", member.user.tag, true)
  .addField("ID", member.user.id, true)
  .addField("Discord Kayıt Tarihi", tarih, true)
  .addField("Sunucuya Katıldığı Tarih", tarih2, true)
  .setThumbnail(member.user.avatarURL)
  kanal.send(embed);
  
});

client.on("guildMemberRemove", member => {
  
  //if (member.author.bot) return;
  
 // if (!logA[member.guild.id]) return;
  
  var user = member.user;
  var tarih = ''
			if(moment(user.createdAt).format('MM') === '01') {
				var tarih = `${moment(user.createdAt).format('DD')} Ocak ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '02') {
				var tarih = `${moment(user.createdAt).format('DD')} Şubat ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '03') {
				var tarih = `${moment(user.createdAt).format('DD')} Mart ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '04') {
				var tarih = `${moment(user.createdAt).format('DD')} Nisan ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '05') {
				var tarih = `${moment(user.createdAt).format('DD')} Mayıs ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '06') {
				var tarih = `${moment(user.createdAt).format('DD')} Haziran ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '07') {
				var tarih = `${moment(user.createdAt).format('DD')} Temmuz ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '08') {
				var tarih = `${moment(user.createdAt).format('DD')} Ağustos ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '09') {
				var tarih = `${moment(user.createdAt).format('DD')} Eylül ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '10') {
				var tarih = `${moment(user.createdAt).format('DD')} Ekim ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '11') {
				var tarih = `${moment(user.createdAt).format('DD')} Kasım ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.createdAt).format('MM') === '12') {
				var tarih = `${moment(user.createdAt).format('DD')} Aralık ${moment(user.createdAt).format('YYYY HH:mm:ss')} `
			}
  
  var tarih2 = ''
			if(moment(user.joinedAt).format('MM') === '01') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Ocak ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '02') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Şubat ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '03') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Mart ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '04') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Nisan ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '05') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Mayıs ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '06') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Haziran ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '07') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Temmuz ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '08') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Ağustos ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '09') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Eylül ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '10') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Ekim ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '11') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Kasım ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
			if(moment(user.joinedAt).format('MM') === '12') {
				var tarih2 = `${moment(user.joinedAt).format('DD')} Aralık ${moment(user.joinedAt).format('YYYY HH:mm:ss')} `
			}
  
  //var kanal = member.guild.channels.get(logA[member.guild.id].log);
  
  if (db.has(`log_${member.guild.id}`) === false) return;
  
  var kanal = member.guild.channels.get(db.fetch(`log_${member.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Sunucudan Bir Kullanıcı Ayrıldı!`, member.user.avatarURL)
  .addField("Kullanıcı Tag", member.user.tag, true)
  .addField("ID", member.user.id, true)
  .addField("Discord Kayıt Tarihi", tarih, true)
  .addField("Sunucuya Katıldığı Tarih", tarih2, true)
  .setThumbnail(member.user.avatarURL)
  kanal.send(embed);
  
});

client.on("messageDelete", message => {
  
  if (message.author.bot) return;
  
  //if (!logA[message.guild.id]) return;
  
  var user = message.author;
  
  //var kanal = message.guild.channels.get(logA[message.guild.id].log);
  
  if (db.has(`log_${message.guild.id}`) === false) return;
  
  var kanal = message.guild.channels.get(db.fetch(`log_${message.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Mesaj Silindi!`, message.author.avatarURL)
  .addField("Kullanıcı Tag", message.author.tag, true)
  .addField("ID", message.author.id, true)
  .addField("Silinen Mesaj", "```" + message.content + "```")
  .setThumbnail(message.author.avatarURL)
  kanal.send(embed);
  
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
  
  if (oldMsg.author.bot) return;
  
 // if (!logA[oldMsg.guild.id]) return;
  
  var user = oldMsg.author;
  
  //var kanal = oldMsg.guild.channels.get(logA[oldMsg.guild.id].log);
  
  if (db.has(`log_${oldMsg.guild.id}`) === false) return;
  
  var kanal = oldMsg.guild.channels.get(db.fetch(`log_${oldMsg.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Mesaj Düzenlendi!`, oldMsg.author.avatarURL)
  .addField("Kullanıcı Tag", oldMsg.author.tag, true)
  .addField("ID", oldMsg.author.id, true)
  .addField("Eski Mesaj", "```" + oldMsg.content + "```")
  .addField("Yeni Mesaj", "```" + newMsg.content + "```")
  .setThumbnail(oldMsg.author.avatarURL)
  kanal.send(embed);
  
});

client.on("roleCreate", role => {
  
 // if (!logA[role.guild.id]) return;
  
  if (db.has(`log_${role.guild.id}`) === false) return;
  
  var kanal = role.guild.channels.get(db.fetch(`log_${role.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Oluşturuldu!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal.send(embed);
  
});

client.on("roleDelete", role => {
  
 // if (!logA[role.guild.id]) return;
  
  if (db.has(`log_${role.guild.id}`) === false) return;
  
 var kanal = role.guild.channels.get(db.fetch(`log_${role.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Kaldırıldı!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal.send(embed);
  
});

client.on("roleUpdate", role => {
  
 // if (!logA[role.guild.id]) return;
  
  if (db.has(`log_${role.guild.id}`) === false) return;
  
  var kanal = role.guild.channels.get(db.fetch(`log_${role.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  
  const embed = new Discord.RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Bir Rol Güncellendi!`, role.guild.iconURL)
  .addField("Rol", `\`${role.name}\``, true)
  .addField("Rol Rengi Kodu", `${role.hexColor}`, true)
  kanal.send(embed);
  
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  
 // if (!logA[oldMember.guild.id]) return;
  
  if (db.has(`log_${oldMember.guild.id}`) === false) return;
  
  var kanal = oldMember.guild.channels.get(db.fetch(`log_${oldMember.guild.id}`).replace("<#", "").replace(">", ""))
  if (!kanal) return;
  
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel

  if(oldUserChannel === undefined && newUserChannel !== undefined) {

    const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`${newMember.user.tag} adlı kullanıcı \`${newUserChannel.name}\` isimli sesli kanala giriş yaptı!`)
    kanal.send(embed);
    
  } else if(newUserChannel === undefined){

    const embed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setDescription(`${newMember.user.tag} adlı kullanıcı bir sesli kanaldan çıkış yaptı!`)
    kanal.send(embed);
    
  }
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${chalk.red(files.length)} ${chalk.green("komut yüklenecek.")}`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`${chalk.green("Yüklenen komut:")} ${chalk.blue(props.help.name)}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.english = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  //log(`${chalk.red(files.length)} ${chalk.green("komut yüklenecek.")}`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    //log(`${chalk.green("Yüklenen komut:")} ${chalk.blue(props.help.name)}.`);
    client.english.set(props.help.enname, props)
  });
});


client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on("message", async msg => {



  if (msg.content === client.ayarlar.prefix+"gizli") {
    msg.channel.send(`**İngilizceye Çevrilmiş Komut Sayısı:** \`${client.english.size}\` \n--------------\n**Toplam Komut Sayısı:** \`${client.commands.size}\` \n\n[${client.commands.size}'da ${client.english.size} ingilizceye çevrilmiş.]`)
  }
  
  const request = require('node-superfetch');
  const db = require('quick.db');
  
  if (msg.channel.type === "dm") return;
  if(msg.author.bot) return;  
  
  if (msg.content.length > 7) {
    
    db.add(`puancik_${msg.author.id + msg.guild.id}`, 1)
};

  if (db.fetch(`puancik_${msg.author.id + msg.guild.id}`) > 150) {
    
    db.add(`seviye_${msg.author.id + msg.guild.id}`, 1)
    
    msg.channel.send(`Tebrik ederim <@${msg.author.id}>! Seviye atladın ve **${db.fetch(`seviye_${msg.author.id + msg.guild.id}`)}** seviye oldun!`)
    
    db.delete(`puancik_${msg.author.id + msg.guild.id}`)
    
  };
});

  
  
  
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube('AIzaSyCJrGp1nROqIEp9mDXd1iV-gl5wYXNeDMs');
const queue = new Map();

client.on("message", async message => {
  
  if (!message.guild) return;
  
  let prefix = await db.fetch(`prefix_${message.guild.id}`) || "k!";
  
  var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
  var searchString = args.slice(1).join(' ');
  var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  var serverQueue = queue.get(message.guild.id);
  
    switch (args[0].toLowerCase()) {
        
      case "oynat":
    var voiceChannel = message.member.voiceChannel;
        
    const embed = new RichEmbed()
    .setColor("RANDOM")
    .setDescription("Dinlemek istediğin şarkıyı yazmalısın! (Şarkı ismi veya Youtube URLsi)")
    if (!url) return message.channel.send(embed);
        
    const voiceChannelAdd = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Lütfen herhangi bir sesli kanala katılınız.`)
    if (!voiceChannel) return message.channel.send(voiceChannelAdd);
    var permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
      const warningErr = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Herhangi bir sesli kanala katılabilmek için yeterli iznim yok.`)
      return message.channel.send(warningErr);
    }
    if (!permissions.has('SPEAK')) {
      const musicErr = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Müzik açamıyorum/şarkı çalamıyorum çünkü kanalda konuşma iznim yok veya mikrofonum kapalı.`)
      return message.channel.send(musicErr);
    }
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      var playlist = await youtube.getPlaylist(url);
      var videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        var video2 = await youtube.getVideoByID(video.id);
        await handleVideo(video2, message, voiceChannel, true);
      }
      const PlayingListAdd = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`[${playlist.title}](https://www.youtube.com/watch?v=${playlist.id}) İsimli şarkı oynatma listesine Eklendi.`)
      return message.channel.send(PlayingListAdd);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
      try {
          var videos = await youtube.searchVideos(searchString, 10);
          
          var r = 1
        
          var video = await youtube.getVideoByID(videos[r - 1].id);
        } catch (err) {
          console.error(err);
          const songNope = new RichEmbed()
          .setColor("RANDOM")
          .setDescription(`Aradığınız isimde bir şarkı bulamadım.`) 
          return message.channel.send(songNope);
        }
      }
      return handleVideo(video, message, voiceChannel);
    }
    break
       case "tekrar":
       const e = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`) 
    if (!message.member.voiceChannel) return message.channel.send(e);
    const p = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(p);
        
    var u = serverQueue.songs[0]
        
    /*var pla = await youtube.getPlaylist(u);
      var v = await pla.getVideos();*/
      var vi2 = await youtube.getVideoByID(u.id);
      await handleVideo(vi2, message, voiceChannel, true);
    const PlayingListAdd = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`[${u.title}](https://www.youtube.com/watch?v=${u.id}) İsimli şarkı bitince tekrar oynatılacak.`)
    return message.channel.send(PlayingListAdd);
        
    break;
      case "geç":
      const err0 = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`) 
    if (!message.member.voiceChannel) return message.channel.send(err0);
    const err05 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(err05);
    const songSkip = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla geçildi!`)
    serverQueue.connection.dispatcher.end('');
    message.channel.send(songSkip)
    return undefined;
break;
      case "durdur":
    const err1 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(err1);
    const err2 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(err2);
    serverQueue.songs = [];
    const songEnd = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla durduruldu ve odadan ayrıldım!`)
    serverQueue.connection.dispatcher.end('');
    message.channel.send(songEnd);
    return undefined;
break;
      case "ses":
      const asd1 = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(asd1);
    const asd2 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(asd2);

    if (!args[1]) return message.reply("Ses seviyesi ayarlamak için bir sayı yaz!");
    serverQueue.volume = args[1];
    if (args[1] > 10) return message.channel.send(`Ses seviyesi en fazla \`10\` olarak ayarlanabilir.`)
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    const volumeLevelEdit = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Ayarlanan Ses Seviyesi: **${args[1]}**`)
    return message.channel.send(volumeLevelEdit);
break;
      case "kuyruk":
      var siralama = 0;
        const a = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(a);
    const b = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(b);
        
    var k = serverQueue.songs.map(song => `${++siralama} - [${song.title}](https://www.youtube.com/watch?v=${song.id})`).join('\n').replace(serverQueue.songs[0].title, `**${serverQueue.songs[0].title}**`)
        
    const kuyruk = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Şarkı Kuyruğu", k)
    return message.channel.send(kuyruk)
break;
case "duraklat":
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        const asjdhsaasjdha = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla duraklatıldı!`)
      return message.channel.send(asjdhsaasjdha);
    }
    return message.channel.send('Şuanda herhangi bir şarkı çalmıyor.');
break;
      case "devamet":
      if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        const asjdhsaasjdhaadssad = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla devam ettiriliyor...`)
      return message.channel.send(asjdhsaasjdhaadssad);
    }
    return message.channel.send('Şuanda herhangi bir şarkı çalmıyor.');
  

  return undefined;
break;
}
async function handleVideo(video, message, voiceChannel, playlist = false) {
  var serverQueue = queue.get(message.guild.id);
  //console.log(video);
  var song = {
    id: video.id,
    title: video.title,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
		durations: video.duration.seconds,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
    requester: message.author.id,
  };
  if (!serverQueue) {
    var queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 3,
      playing: true
    };
    queue.set(message.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Ses kanalına giremedim HATA: ${error}`);
      queue.delete(message.guild.id);
      return message.channel.send(`Ses kanalına giremedim HATA: ${error}`);
    }
  } else {
    serverQueue.songs.push(song);
    //console.log(serverQueue.songs);
    if (playlist) return undefined;

    const songListBed = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}) isimli şarkı kuyruğa eklendi!`)
    return message.channel.send(songListBed);
  }
  return undefined;
}
  function play(guild, song) {
  var serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  //console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', reason => {
      if (reason === 'İnternetten kaynaklı bir sorun yüzünden şarkılar kapatıldı.');
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  
  const playingBed = new RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Şuanda Oynatılıyor`, "https://davidjhinson.files.wordpress.com/2015/05/youtube-icon.png")
  .setDescription(`[${song.title}](${song.url})`)
  .addField("Şarkı Süresi", `${song.durationm}:${song.durations}`, true)
  .addField("Şarkıyı Açan Kullanıcı", `<@${song.requester}>`, true)
  .setThumbnail(song.thumbnail)
  serverQueue.textChannel.send(playingBed);
}
  
  
  //etiketli muzuk ewqeqw
  
  
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const p = String(message.content.match(prefixMention));
  
  if (message.author.bot) return;
  if (!message.content.startsWith(p)) return;
  
  const arg = message.content.slice(p.length).trim().split(/ +/g);
  
    if (!message.content.startsWith(p)) return;
  var searchString = arg.slice(1).join(' ');
  var url = arg[1] ? arg[1].replace(/<(.+)>/g, '$1') : '';
  var serverQueue = queue.get(message.guild.id);
  
    switch (arg[0].toLowerCase()) {
        
      case "oynat":
    var voiceChannel = message.member.voiceChannel;
        
    const embed = new RichEmbed()
    .setColor("RANDOM")
    .setDescription("Dinlemek istediğin şarkıyı yazmalısın! (Şarkı ismi veya Youtube URLsi)")
    if (!url) return message.channel.send(embed);
        
    const voiceChannelAdd = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Lütfen herhangi bir sesli kanala katılınız.`)
    if (!voiceChannel) return message.channel.send(voiceChannelAdd);
    var permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) {
      const warningErr = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Herhangi bir sesli kanala katılabilmek için yeterli iznim yok.`)
      return message.channel.send(warningErr);
    }
    if (!permissions.has('SPEAK')) {
      const musicErr = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Müzik açamıyorum/şarkı çalamıyorum çünkü kanalda konuşma iznim yok veya mikrofonum kapalı.`)
      return message.channel.send(musicErr);
    }
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      var playlist = await youtube.getPlaylist(url);
      var videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        var video2 = await youtube.getVideoByID(video.id);
        await handleVideo(video2, message, voiceChannel, true);
      }
      const PlayingListAdd = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`[${playlist.title}](https://www.youtube.com/watch?v=${playlist.id}) İsimli şarkı oynatma listesine Eklendi.`)
      return message.channel.send(PlayingListAdd);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
      try {
          var videos = await youtube.searchVideos(searchString, 10);
          
          var r = 1
        
          var video = await youtube.getVideoByID(videos[r - 1].id);
        } catch (err) {
          console.error(err);
          const songNope = new RichEmbed()
          .setColor("RANDOM")
          .setDescription(`Aradığınız isimde bir şarkı bulamadım.`) 
          return message.channel.send(songNope);
        }
      }
      return handleVideo(video, message, voiceChannel);
    }
    break
       case "tekrar":
       const e = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`) 
    if (!message.member.voiceChannel) return message.channel.send(e);
    const p = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(p);
        
    var u = serverQueue.songs[0]
        
    /*var pla = await youtube.getPlaylist(u);
      var v = await pla.getVideos();*/
      var vi2 = await youtube.getVideoByID(u.id);
      await handleVideo(vi2, message, voiceChannel, true);
    const PlayingListAdd = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`[${u.title}](https://www.youtube.com/watch?v=${u.id}) İsimli şarkı bitince tekrar oynatılacak.`)
    return message.channel.send(PlayingListAdd);
        
    break;
      case "geç":
      const err0 = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`) 
    if (!message.member.voiceChannel) return message.channel.send(err0);
    const err05 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(err05);
    const songSkip = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla geçildi!`)
    serverQueue.connection.dispatcher.end('');
    message.channel.send(songSkip)
    return undefined;
break;
      case "durdur":
    const err1 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(err1);
    const err2 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(err2);
    serverQueue.songs = [];
    const songEnd = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla durduruldu ve odadan ayrıldım!`)
    serverQueue.connection.dispatcher.end('');
    message.channel.send(songEnd);
    return undefined;
break;
      case "ses":
      const asd1 = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(asd1);
    const asd2 = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(asd2);

    if (!args[1]) return message.reply("Ses seviyesi ayarlamak için bir sayı yaz!");
    serverQueue.volume = args[1];
    if (args[1] > 10) return message.channel.send(`Ses seviyesi en fazla \`10\` olarak ayarlanabilir.`)
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    const volumeLevelEdit = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Ayarlanan Ses Seviyesi: **${args[1]}**`)
    return message.channel.send(volumeLevelEdit);
break;
      case "kuyruk":
      var siralama = 0;
        const a = new RichEmbed()
      .setColor("RANDOM")
      .setDescription(`Bir sesli kanalda değilsin.`)  
    if (!message.member.voiceChannel) return message.channel.send(a);
    const b = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şuanda herhangi bir şarkı çalmıyor.`)
    if (!serverQueue) return message.channel.send(b);
        
    var k = serverQueue.songs.map(song => `${++siralama} - [${song.title}](https://www.youtube.com/watch?v=${song.id})`).join('\n').replace(serverQueue.songs[0].title, `**${serverQueue.songs[0].title}**`)
        
    const kuyruk = new Discord.RichEmbed()
    .setColor("RANDOM")
    .addField("Şarkı Kuyruğu", k)
    return message.channel.send(kuyruk)
break;
case "duraklat":
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        const asjdhsaasjdha = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla duraklatıldı!`)
      return message.channel.send(asjdhsaasjdha);
    }
    return message.channel.send('Şuanda herhangi bir şarkı çalmıyor.');
break;
      case "devamet":
      if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        const asjdhsaasjdhaadssad = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`Şarkı başarıyla devam ettiriliyor...`)
      return message.channel.send(asjdhsaasjdhaadssad);
    }
    return message.channel.send('Şuanda herhangi bir şarkı çalmıyor.');
  

  return undefined;
break;
}
async function handleVideo(video, message, voiceChannel, playlist = false) {
  var serverQueue = queue.get(message.guild.id);
  //console.log(video);
  var song = {
    id: video.id,
    title: video.title,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
		durations: video.duration.seconds,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
    requester: message.author.id,
  };
  if (!serverQueue) {
    var queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 3,
      playing: true
    };
    queue.set(message.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Ses kanalına giremedim HATA: ${error}`);
      queue.delete(message.guild.id);
      return message.channel.send(`Ses kanalına giremedim HATA: ${error}`);
    }
  } else {
    serverQueue.songs.push(song);
    //console.log(serverQueue.songs);
    if (playlist) return undefined;

    const songListBed = new RichEmbed()
    .setColor("RANDOM")
    .setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}) isimli şarkı kuyruğa eklendi!`)
    return message.channel.send(songListBed);
  }
  return undefined;
}
  function play(guild, song) {
  var serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  //console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', reason => {
      if (reason === 'İnternetten kaynaklı bir sorun yüzünden şarkılar kapatıldı.');
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  
  const playingBed = new RichEmbed()
  .setColor("RANDOM")
  .setAuthor(`Şuanda Oynatılıyor`, "https://davidjhinson.files.wordpress.com/2015/05/youtube-icon.png")
  .setDescription(`[${song.title}](${song.url})`)
  .addField("Şarkı Süresi", `${song.durationm}:${song.durations}`, true)
  .addField("Şarkıyı Açan Kullanıcı", `<@${song.requester}>`, true)
  .setThumbnail(song.thumbnail)
  serverQueue.textChannel.send(playingBed);
}
  
  
  
});





client.login('');
