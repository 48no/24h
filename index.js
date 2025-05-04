require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const express = require("express");
const app = express();
const client = new Client();
const PORT = process.env.PORT || 3000;

let currentChannelId = null;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// صفحة HTML ديناميكية
app.get("/", async (req, res) => {
  if (!client.user) return res.send("Bot not ready");

  const uptime = formatUptime(process.uptime());
  const user = client.user;
  const vc = currentChannelId
    ? client.channels.cache.get(currentChannelId)?.name || "?"
    : "Not connected";

  res.send(`
    <html>
    <head>
      <title>Bot 24H ON</title>
      <style>
        body {
          background: #111;
          color: #eee;
          font-family: sans-serif;
          text-align: center;
          padding: 20px;
        }
        img {
          border-radius: 50%;
          width: 120px;
        }
        input {
          padding: 10px;
          margin: 10px;
          width: 300px;
        }
        button {
          padding: 10px 20px;
          margin: 10px;
          background: #444;
          color: white;
          border: none;
          cursor: pointer;
        }
        .copy {
          background: #333;
          border-radius: 5px;
          padding: 5px;
        }
      </style>
    </head>
    <body>
      <h2>Bot 24H ON</h2>
      <div>
        <img src="${user.displayAvatarURL()}" />
        <h3>${user.username}</h3>
        <p>#${user.discriminator}</p>
        <div class="copy">
          <span id="id">${user.id}</span>
          <button onclick="copyId()">Copy ID</button>
        </div>
        <p>VC: ${vc}</p>
        <p>Uptime: ${uptime}</p>
      </div>
      <hr />
      <form method="POST" action="/join">
        <input name="channelId" placeholder="Voice Channel ID" required />
        <input name="guildId" placeholder="Guild ID" required />
        <br />
        <button type="submit">Join VC</button>
      </form>
      <form method="POST" action="/disconnect">
        <input name="guildId" placeholder="Guild ID" required />
        <button type="submit">Disconnect</button>
      </form>

      <script>
        function copyId() {
          const id = document.getElementById("id").innerText;
          navigator.clipboard.writeText(id);
          alert("Copied!");
        }
      </script>
    </body>
    </html>
  `);
});

// انضمام للروم
app.post("/join", async (req, res) => {
  const { channelId, guildId } = req.body;
  try {
    const channel = await client.channels.fetch(channelId);
    joinVoiceChannel({
      channelId,
      guildId,
      selfMute: true,
      selfDeaf: true,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    currentChannelId = channelId;
    res.redirect("/");
  } catch {
    res.send("Failed to join VC");
  }
});

// قطع الاتصال
app.post("/disconnect", async (req, res) => {
  try {
    const connection = getVoiceConnection(req.body.guildId);
    if (connection) {
      connection.destroy();
      currentChannelId = null;
    }
    res.redirect("/");
  } catch {
    res.send("Error disconnecting");
  }
});

// إعادة اتصال تلقائي
setInterval(async () => {
  if (!currentChannelId) return;
  const connection = getVoiceConnection(process.env.guild);
  if (!connection) {
    try {
      const channel = await client.channels.fetch(currentChannelId);
      joinVoiceChannel({
        channelId: currentChannelId,
        guildId: process.env.guild,
        selfMute: true,
        selfDeaf: true,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
    } catch {}
  }
}, 60000);

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);
});

app.listen(PORT, () =>
  console.log(`Web Panel Running at http://localhost:${PORT}`)
);

client.login(process.env.token);
