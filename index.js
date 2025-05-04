const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require("express");
const app = express();

const client = new Client();

const listener = app.listen(process.env.PORT || 2000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

// صفحة الواجهة
app.get("/", async (req, res) => {
  if (!client.user) return res.send("البوت ليس جاهزًا بعد.");
  res.send(`
  <html>
    <head>
      <title>Bot 24H ON</title>
      <style>
        body {
          background: black;
          color: white;
          font-family: sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }
        img {
          border-radius: 50%;
          width: 150px;
          height: 150px;
        }
        .info {
          margin-top: 10px;
          font-size: 18px;
        }
        button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #1e90ff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .status {
          position: absolute;
          top: 30px;
          font-size: 22px;
          color: #0f0;
        }
      </style>
    </head>
    <body>
      <div class="status">Bot 24H ON!</div>
      <img src="${client.user.displayAvatarURL()}" />
      <div class="info">${client.user.username}</div>
      <div class="info">@${client.user.discriminator}</div>
      <div class="info" id="userid">${client.user.id}</div>
      <button onclick="copyID()">نسخ ID</button>
      <button onclick="joinVC()">دخول الروم الآن</button>

      <script>
        function copyID() {
          navigator.clipboard.writeText(document.getElementById("userid").innerText);
          alert("تم نسخ ID");
        }

        function joinVC() {
          fetch("/join", { method: "POST" })
            .then(() => alert("تم إدخال البوت إلى الروم"))
            .catch(() => alert("فشل في الدخول"));
        }
      </script>
    </body>
  </html>
  `);
});

// أمر إدخال الروم عبر زر
app.post("/join", async (req, res) => {
  try {
    const channel = await client.channels.fetch(process.env.channel);
    joinVoiceChannel({
      channelId: channel.id,
      guildId: process.env.guild,
      selfDeaf: true,
      selfMute: true,
      adapterCreator: channel.guild.voiceAdapterCreator
    });
    res.sendStatus(200);
  } catch (err) {
    console.error("Join Voice Error:", err.message);
    res.sendStatus(500);
  }
});

// عند التشغيل
client.on('ready', () => {
  console.log(`${client.user.username} is ready!`);
});

client.login(process.env.token);
