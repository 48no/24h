const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const express = require('express');

const client = new Client();
const app = express();

// تعيين بيانات الرومات
const rooms = [
  {
    name: "دخول روم ليون",
    guildId: "888341433105412096",
    channelId: "888341434506280999"
  },
  {
    name: "دخول روم فواز",
    guildId: "1295847578700878026",
    channelId: "1295860099210022933"
  }
];

// متغير لتحديد أي روم يربط البوت عليه
let currentRoomIndex = 0;

// توصيل إلى روم
async function connectToRoom(index) {
  const room = rooms[index];
  const channel = await client.channels.fetch(room.channelId).catch(() => null);
  if (!channel) return console.log(`Channel ${room.channelId} not found`);

  // فصل الاتصال السابق
  const prevConnection = getVoiceConnection(room.guildId);
  if (prevConnection) prevConnection.destroy();

  joinVoiceChannel({
    channelId: room.channelId,
    guildId: room.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfMute: true,
    selfDeaf: true
  });

  console.log(`Connected to ${room.name}`);
}

// التحقق من الوجود في الروم كل 5 ثواني
setInterval(() => {
  const room = rooms[currentRoomIndex];
  const connection = getVoiceConnection(room.guildId);
  const isInCorrectChannel = connection?.joinConfig?.channelId === room.channelId;

  if (!isInCorrectChannel) {
    console.log(`Not in ${room.name}, reconnecting...`);
    connectToRoom(currentRoomIndex);
  }
}, 5000);

// تسجيل جاهزية البوت
client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  await connectToRoom(currentRoomIndex);
});

// صفحة HTML بسيطة
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Voice Control</title></head>
      <body style="background:#111;color:white;text-align:center;font-family:sans-serif">
        <h1>التحكم في دخول الروم</h1>
        <a href="/join?target=0"><button style="padding:10px 20px;margin:10px;font-size:18px">دخول روم ليون</button></a>
        <a href="/join?target=1"><button style="padding:10px 20px;margin:10px;font-size:18px">دخول روم فواز</button></a>
      </body>
    </html>
  `);
});

// تبديل الروم عند الضغط على زر
app.get('/join', async (req, res) => {
  const index = parseInt(req.query.target);
  if (isNaN(index) || !rooms[index]) {
    return res.send("روم غير معروف");
  }
  currentRoomIndex = index;
  await connectToRoom(index);
  res.redirect('/');
});

// Web server لتشغيل البوت على Render
const listener = app.listen(process.env.PORT || 2000, () => {
  console.log('Web server running');
});

// تسجيل الدخول
client.login(process.env.token);
