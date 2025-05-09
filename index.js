const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const express = require("express");
const app = express();
const client = new Client();

const prayers = [
  "اللهم اجعل هذا اليوم خيرًا لنا ولأحبابنا.",
  "اللهم إنا نسألك العفو والعافية في الدين والدنيا.",
  "اللهم ارزقنا حسن الخاتمة.",
  "اللهم ثبت قلوبنا على طاعتك.",
  "اللهم اجعلنا من الذاكرين الشاكرين.",
  "اللهم استرنا فوق الأرض وتحت الأرض ويوم العرض.",
  "اللهم اجعلنا ممن طال عمره وحسن عمله.",
  "اللهم لا تجعل مصيبتنا في ديننا.",
  "اللهم اجعلنا هداة مهتدين غير ضالين ولا مضلين.",
  "اللهم إنا نعوذ بك من الهم والحزن والعجز والكسل.",
  "اللهم اجعلنا من عبادك الصالحين.",
  "اللهم اجعلنا من الآمنين يوم الفزع الأكبر.",
  "اللهم إنا نعوذ بك من زوال نعمتك وتحول عافيتك.",
  "اللهم اجعل لنا من كل هم فرجًا ومن كل ضيق مخرجًا.",
  "اللهم لا تكلنا إلى أنفسنا طرفة عين.",
  "اللهم ثبتنا بالقول الثابت في الحياة الدنيا وفي الآخرة.",
  "اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة.",
  "اللهم اجعلنا من المقربين إليك.",
  "اللهم اجعل القرآن ربيع قلوبنا.",
  "اللهم اجعلنا ممن يقال لهم: ادخلوها بسلام آمنين."
];
let shuffledPrayers = prayers.sort(() => Math.random() - 0.5);
let prayerIndex = 0;

const cooldown = new Map();
const VOICE_ROOMS = [
  { guildId: "888341433105412096", channelId: "888341434506280999" }, // ليون
  { guildId: "1295847578700878026", channelId: "1295860099210022933" }  // فواز
];

const TEXT_ROOM = "1295859806468440135";

const greetings = [
  "سلام", "سلام عليكم", "سلام عليكم ورحمه",
  "سلام عليكم ورحمه الله", "سلام عليكم ورحمه الله وبركاته",
  "السلام", "السلام عليكم", "السلام عليكم ورحمه",
  "السلام عليكم ورحمه الله", "السلام عليكم ورحمه الله وبركاته"
];

const greetingReplies = [
  "وعليكم السلام ورحمة الله وبركاته منور/ه",
  "وعليكم السلام ورحمة الله وبركاته ولكم",
  "وعليكم السلام ورحمة الله وبركاته حياك الله"
];

const backReplies = [
  "ولكم", "ولكم باك", "منور/ه"
];

app.get("/", (_, res) => {
  res.send(`
    <body style="background:#111;color:white;text-align:center">
      <h1>Bot 24/7 ON</h1>
      <a href="/join1"><button>دخول روم ليون</button></a>
      <a href="/join2"><button>دخول روم فواز</button></a>
    </body>
  `);
});

app.get("/join1", (_, res) => {
  joinVoice(VOICE_ROOMS[0]);
  res.send("تم دخول روم ليون");
});

app.get("/join2", (_, res) => {
  joinVoice(VOICE_ROOMS[1]);
  res.send("تم دخول روم فواز");
});

app.listen(process.env.PORT || 2000, () => console.log("Ready 24H"));

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);

  // دخول الرومات الصوتية تلقائي
  setInterval(() => {
    VOICE_ROOMS.forEach(room => {
      const conn = getVoiceConnection(room.guildId);
      if (!conn || conn.joinConfig.channelId !== room.channelId) {
        joinVoice(room);
      }
    });
  }, 5000);

  // إرسال دعاء كل ربع ساعة
  setInterval(() => {
    const channel = client.channels.cache.get(TEXT_ROOM);
    if (channel) {
      channel.send(shuffledPrayers[prayerIndex]);
      prayerIndex = (prayerIndex + 1) % shuffledPrayers.length;
      if (prayerIndex === 0) {
        shuffledPrayers = prayers.sort(() => Math.random() - 0.5); // خلط جديد
      }
    }
  }, 15 * 60 * 1000); // كل ربع ساعة
});

client.on("messageCreate", (msg) => {
  if (msg.channel.id !== TEXT_ROOM || msg.author.id === client.user.id) return;

  const now = Date.now();
  const last = cooldown.get(msg.author.id) || 0;
  if (now - last < 30_000) return; // 30 ثانية كول داون

  const content = msg.content.toLowerCase();

  if (greetings.includes(content)) {
    const reply = greetingReplies[Math.floor(Math.random() * greetingReplies.length)];
    msg.reply(reply);
    cooldown.set(msg.author.id, now);
  }

  if (content === "برب") {
    msg.reply("تيت موفق/ه لاتتاخر/ي");
    cooldown.set(msg.author.id, now);
  }

  if (content === "باك") {
    const reply = backReplies[Math.floor(Math.random() * backReplies.length)];
    msg.reply(reply);
    cooldown.set(msg.author.id, now);
  }
});

function joinVoice({ guildId, channelId }) {
  const channel = client.channels.cache.get(channelId);
  if (!channel || !channel.isVoice()) return;

  joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: true
  });
}

client.login(process.env.token);
