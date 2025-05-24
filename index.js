const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const client = new Client();

const prayers = [

  "يلعن شرف اهل ام امك ياديوث",
  "ياابن القحبة ياابن النعال",
  "ولك انا كور ياخنيث ياديوث",
  "العن شرف اهل ام امك",
  "ادقدق راس امك ياخنيث",
  "ياديوث ياابن القحبة ياابن النعال",
  "ولك العن شرف اهل ام امك",
  "انيك عرض اهل ام امك يا خنيث ياابن القحبة",
  "ياديوث ياخنيث ياابن الشرموطة",
  "تعال على زبي ياخنيث ياابن القحبة",
  "لاتخليني انجن عليك يااخو الشرموطة",
  "ياخنيث ياديوث ياابن بلاعة الزب",
  "ولك بنجن على امك ياديوث ياقحبة",
  "العن امك ياشرموطة واكل وانيك امك",
  "*لا انيك شرف اهل ام امك هنا ياشرموط",
  "العن امك ياقحبة ياابن القحبة",
  "اشفشف كسمك ياخنيث ",
  "العن امك ياخنيث ياديوث ياابن النعال",
  "انا هنا نياك امك ياقحبة",
  "ولك تعال اركب زبي ياخنيث ياديوث",
  "ياقحبة اشخ على امك وانت تسكت",
  "قدامك عمك كور ياقحبة ",
  "العن شرف اهل ام امك ياخنيث"
];

while (prayers.length < 100) {
  const base = prayers[Math.floor(Math.random() * 10)];
  prayers.push(base);  // بدون "آمين"
}
let shuffledPrayers = prayers.sort(() => Math.random() - 0.5);
let prayerIndex = 0;

const VOICE_ROOM = { guildId: "1280926268631810118", channelId: "1375895928682184945" };
const TEXT_ROOM = "1363218965957968062";

let mentionId = "1347950525047509072"; // الافتراضي
let prayersEnabled = false;

app.use(bodyParser.json());

app.get("/", (_, res) => {
  if (!client.user) return res.send("البوت لم يسجل الدخول بعد.");
  const user = client.user;
  const avatar = user.displayAvatarURL();
  const username = user.username;
  const id = user.id;

  res.send(`
    <body style="background:#111;color:white;text-align:center;font-family:sans-serif">
      <h1 style="color:#0f0">البوت شغال 24 ساعة</h1>
      <img src="${avatar}" width="128" style="border-radius:50%"><br><br>
      <div><strong>يوزر:</strong> ${username}#${user.discriminator}</div>
      <div><strong>ID:</strong> <span id="uid">${id}</span>
        <button onclick="copyID()">نسخ</button>
      </div><br>

      <label>تفعيل الطباعة:
        <input type="checkbox" id="togglePrayers" ${prayersEnabled ? "checked" : ""}>
      </label><br><br>

      <label>اكتب ID المنشن: <input type="text" id="mentionInput" value="${mentionId}" style="width:250px"></label><br><br>

      <button onclick="saveSettings()">حفظ وتشغيل</button>

      <script>
        function copyID() {
          const id = document.getElementById('uid').innerText;
          navigator.clipboard.writeText(id);
          alert("تم نسخ ID");
        }

        async function saveSettings() {
          const enabled = document.getElementById('togglePrayers').checked;
          const mention = document.getElementById('mentionInput').value.trim();

          const res = await fetch('/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prayersEnabled: enabled, mentionId: mention })
          });

          if(res.ok) {
            alert('تم تحديث الإعدادات بنجاح');
          } else {
            alert('حدث خطأ أثناء التحديث');
          }
        }
      </script>
    </body>
  `);
});

app.post("/settings", (req, res) => {
  const { prayersEnabled: enabled, mentionId: mention } = req.body;
  if (typeof enabled === "boolean" && typeof mention === "string") {
    prayersEnabled = enabled;
    mentionId = mention;
    console.log(`تم تحديث الإعدادات: التفعيل = ${prayersEnabled}, المنشن = ${mentionId}`);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

client.on("ready", () => {
  console.log(`${client.user.username} جاهز`);

  setInterval(() => {
    if (!prayersEnabled) return;

    const channel = client.channels.cache.get(TEXT_ROOM);
    if (channel) {
      channel.send(`**<@${mentionId}> ${shuffledPrayers[prayerIndex]}**`);
      prayerIndex = (prayerIndex + 1) % shuffledPrayers.length;
      if (prayerIndex === 0) shuffledPrayers = prayers.sort(() => Math.random() - 0.5);
    }
  }, 10 * 60 * 1000);
});

client.login(process.env.TOKEN);
app.listen(process.env.PORT || 3000);
