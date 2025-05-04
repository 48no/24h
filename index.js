const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require("express");
const app = express();
const client = new Client();

const CHANNEL_ID = process.env.channel;
const GUILD_ID = process.env.guild;
const MONITOR_CHANNEL_ID = "923660518789623839";
const PRAYERS = [
  "اللهم اجعل هذا اليوم بركة.",
  "اللهم ارزقنا رضاك والجنة.",
  "اللهم اغفر لنا ذنوبنا.",
  "اللهم اشرح صدورنا ويسر أمورنا.",
  "اللهم ارزقنا الصبر والثبات.",
  "اللهم اجعلنا من عبادك الصالحين.",
  "اللهم اجعلنا من أهل القرآن.",
  "اللهم نسألك العفو والعافية.",
  "اللهم اجعلنا من التوابين.",
  "اللهم أعنا على ذكرك وشكرك.",
  "اللهم توفنا وأنت راضٍ عنا.",
  "اللهم احفظ أحبّتنا من كل سوء.",
  "اللهم ارزقنا حسن الخاتمة.",
  "اللهم زدنا إيمانًا ويقينًا.",
  "اللهم باعد بيننا وبين خطايانا.",
  "اللهم أنر قبور موتانا.",
  "اللهم اجعل القرآن ربيع قلوبنا.",
  "اللهم انصر الإسلام والمسلمين.",
  "اللهم اجعلنا من الذاكرين الشاكرين.",
  "اللهم لا تحرمنا خيرك بجهلنا.",
  "اللهم اجعلنا هداة مهتدين.",
  "اللهم اجعل يومنا هذا مباركًا.",
  "اللهم اجعلنا ممن طال عمره وحسن عمله.",
  "اللهم لا تجعلنا من الغافلين.",
  "اللهم أدم علينا نعمك.",
  "اللهم اجعلنا من الذين إذا أحسنوا استبشروا.",
  "اللهم وفقنا لما تحب وترضى.",
  "اللهم أعذنا من شرور أنفسنا.",
  "اللهم اجعلنا من الصادقين.",
  "اللهم حبب إلينا الإيمان.",
  "اللهم اجعلنا من المتقين.",
  "اللهم اجعلنا من المطمئنين بذكرك.",
  "اللهم ثبتنا عند السؤال.",
  "اللهم اجعلنا ممن يظلهم عرشك.",
  "اللهم إنا نسألك الجنة.",
  "اللهم قنا عذاب النار.",
  "اللهم تقبل دعاءنا.",
  "اللهم اجعل أعمالنا خالصة لوجهك.",
  "اللهم إنا نسألك رضاك والجنة.",
  "اللهم اجعلنا من المحسنين.",
  "اللهم اجعلنا من المتوكلين عليك.",
  "اللهم اجعلنا من المتواضعين.",
  "اللهم لا تكلنا إلى أنفسنا طرفة عين.",
  "اللهم ارزقنا علماً نافعاً.",
  "اللهم اجعلنا من الذاكرين لك كثيراً.",
  "اللهم احفظنا بحفظك.",
  "اللهم اجعلنا من عبادك الصالحين.",
  "اللهم اجعل يومنا خيراً من أمسنا.",
  "اللهم اجعلنا من السابقين بالخيرات.",
  "اللهم اجعلنا من الشاكرين لنعمك."
];

let startTime = Date.now();

// تشغيل موقع بسيط لعرض معلومات البوت
app.get('/', async (req, res) => {
  const uptime = formatDuration(Date.now() - startTime);
  res.send(`
    <body style="background-color: #111; color: white; font-family: Arial; text-align: center;">
      <h1>Bot 24H ON!</h1>
      <img src="${client.user.displayAvatarURL()}" style="width: 128px; border-radius: 50%; margin-top: 20px;" />
      <h2>${client.user.username}</h2>
      <p>@${client.user.tag}</p>
      <button onclick="navigator.clipboard.writeText('${client.user.id}')" style="padding: 10px 20px; margin: 10px;">Copy ID</button>
      <p>Uptime: ${uptime}</p>
    </body>
  `);
});
var listener = app.listen(process.env.PORT || 2000, () => {
  console.log('Web server running on port ' + listener.address().port);
});

// عند تشغيل البوت
client.on('ready', () => {
  console.log(`${client.user.username} is ready!`);

  // الدخول المستمر للروم الصوتي
  setInterval(() => {
    client.channels.fetch(CHANNEL_ID)
      .then(channel => {
        joinVoiceChannel({
          channelId: channel.id,
          guildId: GUILD_ID,
          selfMute: true,
          selfDeaf: true,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
      })
      .catch(() => {});
  }, 10000); // كل 10 ثواني للتأكد من الاتصال

  // إرسال دعاء كل 10 دقائق
  setInterval(() => {
    const prayer = PRAYERS[Math.floor(Math.random() * PRAYERS.length)];
    const channel = client.channels.cache.get(MONITOR_CHANNEL_ID);
    if (channel) channel.send(prayer);
  }, 10 * 60 * 1000);
});

// الردود التلقائية
client.on('messageCreate', async (message) => {
  if (message.channel.id !== MONITOR_CHANNEL_ID) return;
  if (message.author.id === client.user.id) return;

  const content = message.content.toLowerCase();

  // رد السلام
  const salamWords = [
    "سلام", "السلام", "السلام عليكم", "سلام عليكم", 
    "السلام عليكم ورحمة الله", "سلام عليكم ورحمة الله"
  ];
  if (salamWords.some(word => content.includes(word))) {
    return message.reply("وعليكم السلام ورحمة الله وبركاته <a:SXB_RedLove:1020384635496169482>");
  }

  // رد البرب
  if (content.includes("برب")) {
    return message.reply("تيت موفق/ه, لا تطول/ي <a:SXB_BabyLove:953950566374076428>");
  }

  // رد الباك
  if (content.includes("باك")) {
    return message.reply("ولكم باك <:SXB_isaedxRose:1249110291367854161>");
  }
});

// تسجيل دخول البوت
client.login(process.env.token);

// دالة لحساب مدة التشغيل
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
