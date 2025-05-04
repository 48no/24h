const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require("express");
const app = express();

const client = new Client();

const PORT = process.env.PORT || 2000;
const CHANNEL_ID = "923660518789623839"; // ID الشات
const VOICE_CHANNEL_ID = process.env.channel;
const GUILD_ID = process.env.guild;

const duas = [
  "اللهم اجعلني من التوابين.",
  "اللهم لا تكلني إلى نفسي طرفة عين.",
  "اللهم تول أمري كله.",
  "اللهم اجعلني مقيم الصلاة.",
  "اللهم قني عذابك يوم تبعث عبادك.",
  "اللهم اغفر لي ولوالدي.",
  "اللهم إني أسألك العفو والعافية.",
  "رب اغفر وارحم وأنت خير الراحمين.",
  "اللهم إنك عفو تحب العفو فاعفُ عني.",
  "اللهم اهدني وسددني.",
  "رب زدني علماً.",
  "اللهم إني أسألك الجنة.",
  "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
  "اللهم يسر لي أمري.",
  "اللهم فرج همي.",
  "اللهم اجعلني من عبادك الصالحين.",
  "اللهم ارزقني الإخلاص.",
  "اللهم حبب إلي الإيمان.",
  "اللهم اجعلني هادياً مهدياً.",
  "اللهم ثبت قلبي على دينك.",
  "اللهم استعملني في طاعتك.",
  "اللهم اغنني بحلالك عن حرامك.",
  "اللهم اجعلني من المتوكلين عليك.",
  "اللهم اجعلني من الشاكرين.",
  "اللهم تقبل مني صالح الأعمال.",
  "اللهم اجعل القرآن ربيع قلبي.",
  "اللهم افتح لي أبواب رحمتك.",
  "اللهم اجعلني من الصابرين.",
  "اللهم إني أعوذ بك من الهم والحزن.",
  "اللهم لا تجعل مصيبتي في ديني.",
  "اللهم اجعلني من عبادك المخلصين.",
  "اللهم اجعل عملي خالصاً لوجهك.",
  "اللهم باعد بيني وبين خطاياي.",
  "اللهم إني أعوذ بك من قلب لا يخشع.",
  "اللهم ارزقني توبة نصوحاً.",
  "اللهم نور قبري.",
  "اللهم ثبتني عند السؤال.",
  "اللهم إني أسألك حسن الخاتمة.",
  "اللهم اجعلني من المحسنين.",
  "اللهم اجعلني من المتقين.",
  "اللهم اجعلني من الذاكرين.",
  "اللهم اجعلني من الراضين.",
  "اللهم اجعلني من الموقنين.",
  "اللهم اجعلني من المتواضعين.",
  "اللهم إني أعوذ بك من الكسل.",
  "اللهم إني أعوذ بك من الجبن.",
  "اللهم قني شر نفسي.",
  "اللهم ارزقني لذة النظر إلى وجهك.",
  "اللهم لا تحرمني لذة مناجاتك.",
  "اللهم اجعلني من الذين إذا أحسنوا استبشروا."
];

// واجهة الموقع
app.get('/', (req, res) => {
  res.send(`
  <body style="background:black;color:white;text-align:center;font-family:sans-serif;">
    <h1>Bot 24H ON!</h1>
    <img src="${client.user?.displayAvatarURL() || ''}" style="border-radius:50%;width:150px;"><br>
    <h2>${client.user?.username || ''}</h2>
    <p>@${client.user?.tag || ''}</p>
    <p>ID: <span id="uid">${client.user?.id || ''}</span> <button onclick="copy()">Copy</button></p>
    <p>البوت يعمل منذ: <span id="uptime"></span></p>
    <script>
      function copy() {
        navigator.clipboard.writeText(document.getElementById("uid").innerText);
        alert("تم نسخ ID");
      }
      setInterval(() => {
        const seconds = Math.floor(performance.now() / 1000);
        document.getElementById("uptime").innerText = seconds + " ثانية";
      }, 1000);
    </script>
  </body>
  `);
});
app.listen(PORT, () => console.log("I'm Ready To Work..! 24H"));

client.on('ready', () => {
  console.log(`${client.user.username} is ready!`);

  // دخول روم الصوت بدون إعادة تشغيل
  setInterval(() => {
    client.channels.fetch(VOICE_CHANNEL_ID).then(channel => {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: GUILD_ID,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: true
      });
    }).catch(() => {});
  }, 10000); // كل 10 ثواني يتأكد

  // إرسال دعاء عشوائي كل 10 دقائق
  setInterval(() => {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel && channel.isText()) {
      const randomDua = duas[Math.floor(Math.random() * duas.length)];
      channel.send(`**${randomDua}**`);
    }
  }, 10 * 60 * 1000);
});

// الردود
client.on('messageCreate', message => {
  if (message.channel.id !== CHANNEL_ID || message.author.bot) return;

  const content = message.content.toLowerCase();
  if (["سلام", "السلام", "سلام عليكم", "السلام عليكم", "السلام عليكم ورحمة الله", "سلام عليكم ورحمة الله"].some(txt => content.includes(txt))) {
    message.reply("عليكم السلام ورحمة الله وبركاته <a:SXB_RedLove:1020384635496169482>");
  } else if (content.includes("برب")) {
    message.reply("تيت موفق/ه, لا تطول/ي <a:SXB_BabyLove:953950566374076428>");
  } else if (content.includes("باك")) {
    message.reply("ولكم باك <:SXB_isaedxRose:1249110291367854161>");
  }
});

client.login(process.env.token);
