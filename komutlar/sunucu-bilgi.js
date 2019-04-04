const Discord = require('discord.js');
//const ayarlar = require('../ayarlar.json');
const moment = require('moment');
require('moment-duration-format');
var db = require('quick.db');

exports.run = async (client, message, params) => {
  
  const db = require('quick.db');
  
  var s = 'tr'
  var a = client.commands.get('sunucu-bilgi').help.name
  var g = "`r!roller` yazarak görebilirsiniz."
  var g2 = "`r!emojiler` yazarak görebilirsiniz."
  var x = "Aktif"
  var y = "Deaktif"
  var konum = ''
        if(message.guild.region === "russia") {
            var konum = 'Rusya :flag_ru:'
        }
        if(message.guild.region === "us-west") {
            var konum = 'Batı Amerika :flag_us: '
        }
        if(message.guild.region === "us-south") {
            var konum = 'Güney Amerika :flag_us: '
        }
        if(message.guild.region === "us-east") {
            var konum = 'Doğu Amerika :flag_us: '
        }
        if(message.guild.region === "us-central") {
            var konum = 'Amerika :flag_us: '
        }
        if(message.guild.region === "brazil") {
            var konum = 'Brezilya :flag_br:'
        }
        if(message.guild.region === "singapore") {
            var konum = 'Singapur :flag_sg:'
        }
        if(message.guild.region === "sydney") {
            var konum = 'Sidney :flag_sh:'
        }
        if(message.guild.region === "eu-west") {
            var konum = 'Batı Avrupa :flag_eu:'
        }
        if(message.guild.region === "eu-south") {
            var konum = 'Güney Avrupa :flag_eu:'
        }
        if(message.guild.region === "eu-east") {
            var konum = 'Doğu Avrupa :flag_eu:'
        }
        if(message.guild.region === "eu-central") {
            var konum = 'Avrupa :flag_eu:'
        }
        if(message.guild.region === "hongkong") {
            var konum = 'Hong Kong :flag_hk: '
        }
        if(message.guild.region === "japan") {
            var konum = 'Japonya :flag_jp:'
        }
       if (message.guild.region === "south-africa") {
         var konum = 'Güney Afrika'
       }
  
    if(db.has(`dil_${message.guild.id}`) === true) {
        var s = 'en'
        var a = client.commands.get('sunucu-bilgi').help.enname
        var g = "You can see by writing `r!roles`."
        var g2 = "You can see by writing `r!emojis`."
        var x = "Active"
        var y = "Unactive"
        var konum = ''
        if(message.guild.region === "russia") {
            var konum = 'Russia :flag_ru:'
        }
        if(message.guild.region === "us-west") {
            var konum = 'West America :flag_us: '
        }
        if(message.guild.region === "us-south") {
            var konum = 'South America :flag_us: '
        }
        if(message.guild.region === "us-east") {
            var konum = 'East America :flag_us: '
        }
        if(message.guild.region === "us-central") {
            var konum = 'America :flag_us: '
        }
        if(message.guild.region === "brazil") {
            var konum = 'Brazil :flag_br:'
        }
        if(message.guild.region === "singapore") {
            var konum = 'Singapore :flag_sg:'
        }
        if(message.guild.region === "sydney") {
            var konum = 'Sydney :flag_sh:'
        }
        if(message.guild.region === "eu-west") {
            var konum = 'West Europe :flag_eu:'
        }
        if(message.guild.region === "eu-south") {
            var konum = 'Southern Europe :flag_eu:'
        }
        if(message.guild.region === "eu-east") {
            var konum = 'Eastern Europe :flag_eu:'
        }
        if(message.guild.region === "eu-central") {
            var konum = 'Europe :flag_eu:'
        }
        if(message.guild.region === "hongkong") {
            var konum = 'Hong Kong :flag_hk: '
        }
        if(message.guild.region === "japan") {
            var konum = 'Japan :flag_jp:'
        }
      if (message.guild.region === "south-africa") {
         var konum = 'South Africa'
       }
    }
    const dil = client[s]
    const o = a
  
  const aylar = dil.months
  
  let prefix = await db.fetch(`prefix_${message.guild.id}`) || `${dil.ayarlar.errors.degismemis} (r!)`;
  /*if(db.has(`komutkomuts_${message.guild.id}`)) {
for(var i = 0; i < db.fetch(`komutkomuts_${message.guild.id}`);) {
  
 var k = db.fetch(`komutkomut_${message.guild.id}_${i}`)
}
  }*/
  
   const embed = new Discord.RichEmbed()
   .setColor("RANDOM")
   .setThumbnail(message.guild.iconURL)
   .setAuthor(`${message.guild.name} - ${dil.sunucu.header}`, message.guild.iconURL)
   .addField(dil.sunucu.isim, message.guild.name, true)
   .addField(dil.sunucu.id, message.guild.id, true)
   .addField(dil.sunucu.konum, konum || dil.unknow, true)
   .addField(dil.sunucu.owner, message.guild.owner + client.emojis.get("516215213960462336"), true)
   .addField(dil.sunucu.members.all+' ['+message.guild.memberCount+']', `${client.emojis.get('509055599946760212')}${dil.sunucu.members.online}: ${message.guild.members.filter(m => m.user.presence.status === "online").size} \n${client.emojis.get('509054756770152458')}${dil.sunucu.members.dnd}: ${message.guild.members.filter(m => m.user.presence.status === "dnd").size} \n${client.emojis.get('509054756669358100')}${dil.sunucu.members.idle}: ${message.guild.members.filter(m => m.user.presence.status === "idle").size} \n${client.emojis.get('509054756233150466')}${dil.sunucu.members.offline}: ${message.guild.members.filter(m => m.user.presence.status === "offline").size} \n${client.emojis.get('482490295754162176')}${dil.sunucu.members.bot}: ${message.guild.members.filter(m => m.user.bot).size}`, true)
   .addField(dil.sunucu.channels.all+' ['+message.guild.channels.size+']', `📝${dil.sunucu.channels.text}: ${message.guild.channels.filter(c => c.type === "text").size} \n🔊${dil.sunucu.channels.voice}: ${message.guild.channels.filter(c => c.type === "voice").size} \n📋${dil.sunucu.channels.category}: ${message.guild.channels.filter(c => c.type === "category").size} \n💤${dil.sunucu.channels.afk}: ${message.guild.afkChannel ? message.guild.afkChannel : dil.dont}`, true)
   .addField(dil.sunucu.roles+' ['+message.guild.roles.size+']', g, true)
   .addField(dil.sunucu.emojis+' ['+message.guild.emojis.size+']', g2, true)
   .addField(dil.sunucu.tarih, `${moment(message.guild.createdAt).format('DD')} ${aylar[moment(message.guild.createdAt).format('MM')]} ${moment(message.guild.createdAt).format('YYYY HH:mm:ss')}`, true)
   .addField(dil.sunucu.prefix, "`"+prefix+"`", true)
  // .addField(dil.sunucu.komut, "`"+k || "Bulunmuyor"+"`", true)
   .addField(dil.sunucu.puan, db.fetch(`sunucuxp_${message.guild.id}`)+"/50" || 0)
   .addField(dil.sunucu.premium, db.has(`premium_${message.guild.id}`) ? db.fetch(`premium_${message.guild.id}`).replace("aktif", x) : y)
   message.channel.send({embed});
 };

 exports.conf = {
   enabled: true,
   guildOnly: false,
   aliases: ["sunucu", "server"],
   permLevel: 0,
    kategori: "sunucu",
   category: "server"
 };

 exports.help = {
   name: 'sunucu-bilgi',
   description: 'Bulunduğunuz sunucu hakkında bilgi verir.',
   usage: 'sunucu-bilgi',
   enname: 'server-info',
   endescription: 'Gives information about your current server.',
   enusage: 'server-info'
 };