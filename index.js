const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");
const express = require("express");
const play = require("play-dl");
const app = express();
const client = new Client();

const prayers = [
  "**اللهم اجعل هذا اليوم بداية خير وسعادة، وارزقنا فيه توفيقك ورضاك، وابعد عنا شر ما قضيت.**",
  "**اللهم اجعلنا في هذا اليوم من الذين ناديتهم فلبّوك، وغفرت لهم ذنوبهم، ويسرت لهم أمرهم، وباركت في رزقهم.**",
  "**اللهم اجعل يومنا هذا شاهدًا لنا لا علينا، وافتح لنا أبواب الخير والتوفيق، واغفر لنا ما مضى.**",
  "**اللهم إنك عفو كريم تحب العفو فاعفُ عنا، واغفر ذنوبنا، ويسر لنا أمرنا، وأصلح حالنا.**",
  "**اللهم ارزقنا نورًا في القلب، وسعة في الرزق، وصحة في الجسد، وبركة في العمر، ورضاك علينا.**",
  "**اللهم إنا نسألك صباحًا يملؤه الأمل، ويُشرق فيه نور رضاك، وتتحقق فيه أمانينا وأحلامنا.**",
  "**اللهم في هذا الصباح اجعلنا ممن سعدتَ بقبولهم، ورضيت عنهم، وغفرت لهم، وكتبت لهم الخير في الدنيا والآخرة.**",
  "**اللهم اجعل لنا في هذا اليوم دعوة لا تُرد، ورزقًا لا يُعد، وبابًا إلى الجنة لا يُسد.**",
  "**اللهم اغفر لنا ذنوبنا، واستر عيوبنا، ووفقنا لما تحب وترضى، وبارك لنا في أعمارنا وأعمالنا.**",
  "**اللهم اجعل لنا من كل همٍ فرجًا، ومن كل ضيقٍ مخرجًا، ومن كل بلاءٍ عافية.**",
  "**اللهم اجعلنا من عبادك الذين لا خوف عليهم ولا هم يحزنون، وامنحنا سعادة لا تزول.**",
  "**اللهم يا أرحم الراحمين، ارحم ضعفنا، وتولَّ أمرنا، واجبر كسرنا، واغننا بفضلك عمن سواك.**",
  "**اللهم إنا نسألك في هذا اليوم توفيقًا في العمل، وسعة في الرزق، وصلاحًا في الذرية، وطمأنينة في القلب.**",
  "**اللهم اجعلنا ممن إذا أحسن استبشر، وإذا أساء استغفر، وإذا أذنب تاب، وإذا ابتُلي صبر.**",
  "**اللهم اجعل هذا اليوم بداية لكل خير، ونهاية لكل همّ، واجعله فاتحة للبركة والرزق والسعادة.**",
  "**اللهم إنا نسألك رضاك والجنة، ونعوذ بك من سخطك والنار، اللهم اجعلنا من المقبولين لديك.**",
  "**اللهم اجعلنا ممن تتنزل عليهم رحماتك، وتغشاهم السكينة، وتحفهم الملائكة، ويذكرهم الله فيمن عنده.**",
  "**اللهم احفظنا بعينك التي لا تنام، واكلأنا بركنك الذي لا يُضام، وارزقنا حسن الخاتمة.**",
  "**اللهم ارزقنا قلبًا خاشعًا، ولسانًا ذاكرًا، وعينًا دامعة، ونفسًا مطمئنة، وعملًا متقبلًا.**",
  "**اللهم اجعلنا ممن تبتهج أرواحهم برضاك، ولا يخافون فيك لوم لائم، واجعلنا من المقربين.**",
  "**اللهم في هذا اليوم اجعلنا من عبادك المحبوبين، الذين لا خوف عليهم ولا هم يحزنون، اللهم آمين.**",
  "**اللهم أنزل علينا من بركات السماء، وأخرج لنا من خيرات الأرض، وبارك لنا في أرزاقنا وأوقاتنا.**",
  "**اللهم اجعل يومنا هذا يوم فرح لا حزن فيه، ويوم نجاح لا فشل فيه، ويوم قرب منك لا بعد.**",
  "**اللهم خذ بأيدينا إليك أخذ الكرام عليك، واجعلنا هداةً مهتدين، لا ضالين ولا مضلين.**",
  "**اللهم لا تجعل حاجتنا عند أحد من خلقك، واقضها لنا بما تشاء وكيف تشاء، وأنت أرحم الراحمين.**",
  "**اللهم اجعلنا من الصابرين في البلاء، الشاكرين في الرخاء، الراكعين الساجدين آناء الليل وأطراف النهار.**",
  "**اللهم اجعل عملنا في هذا اليوم خالصًا لوجهك الكريم، ولا تجعل فيه لأحد سواك نصيبًا.**",
  "**اللهم طهر قلوبنا من الحقد والحسد، واملأها حبًا وتسامحًا، وأصلح ذات بيننا، وبارك في علاقاتنا.**",
  "**اللهم لا تردنا خائبين، ولا تجعلنا من القانطين، وكن لنا وليًا ونصيرًا ومعينًا.**",
  "**اللهم ارزقنا حج بيتك الحرام، وزيارة نبيك عليه الصلاة والسلام، وبلغنا رمضان أعوامًا عديدة.**",
  "**اللهم اجعلنا في هذا اليوم من التوابين، ومن عبادك المتقين، ومن أصحاب النفوس المطمئنة.**",
  "**اللهم اجعلنا ممن دعاك فأجبت، وتوكل عليك فكفيت، واستغفرك فغفرت له، واستعان بك فأعنت.**",
  "**اللهم اجعل لنا في كل خطوة سلامة، وفي كل دعاء استجابة، وفي كل رزق بركة.**",
  "**اللهم اجعلنا ممن ينادَون يوم القيامة: ادخلوا الجنة لا خوف عليكم ولا أنتم تحزنون.**",
  "**اللهم بارك لنا في وقتنا وأعمارنا، واجعلنا من الذاكرين الشاكرين، المحسنين المتواضعين.**",
  "**اللهم اجعلنا ممن قلت فيهم: {إن الذين آمنوا وعملوا الصالحات كانت لهم جنات الفردوس نُزُلاً}.**",
  "**اللهم خذ بأيدينا لما تحب وترضى، ووفقنا لما فيه صلاح ديننا ودنيانا وآخرتنا.**",
  "**اللهم لا تجعل مصيبتنا في ديننا، ولا تجعل الدنيا أكبر همنا، واجعل الجنة هي دارنا ومآلنا.**",
  "**اللهم اجعلنا من عبادك المخلصين، واجعلنا ممن يحبك وتحبهم، ويرضى عنهم وترضى عنهم.**",
  "**اللهم إنّا نسألك العفو والعافية في الدين والدنيا، ونسألك تمام الصحة، ودوام النعمة، وسعة الرزق.**",
  "**اللهم إنا نسألك موجبات رحمتك، وعزائم مغفرتك، والسلامة من كل إثم، والغنيمة من كل بر، والفوز بالجنة.**",
  "**اللهم لا تجعل لنا ذنبًا إلا غفرته، ولا همًا إلا فرجته، ولا حاجة من حوائج الدنيا والآخرة إلا قضيتها.**",
  "**اللهم اجعلنا ممن توكل عليك فكفيته، واستعان بك فأعَنته، واستغفرك فغفرت له.**",
  "**اللهم ارزقنا سكينة في القلب، وصفاء في النفس، وطمأنينة لا تزول مهما تغيرت الظروف.**",
  "**اللهم لا تعلق قلوبنا بما ليس لنا، واجعل لنا فيما نحب نصيبًا يرضيك.**",
  "**اللهم اجعلنا ممن يحملون قلوبًا بيضاء، لا حقد فيها ولا حسد، ولا ضغينة، واجعلنا مباركين أينما كنا.**",
  "**اللهم اجعلنا نورًا لمن حولنا، ورحمةً لمن نلقاهم، وسببًا في فرج كل مهموم.**",
  "**اللهم اجعلنا ممن يسيرون في الأرض برحمة، ويتكلمون بحكمة، ويعطون بسخاء، ويُحبون بصدق.**"
];


// تكرار الأدعية إذا خلصت
while (prayers.length < 100) {
  const base = prayers[Math.floor(Math.random() * 10)];
  prayers.push(base + " آمين.");
}
let shuffledPrayers = prayers.sort(() => Math.random() - 0.5);
let prayerIndex = 0;

const VOICE_ROOM = { guildId: "1295847578700878026", channelId: "1295860054448148511" };
const TEXT_ROOM = "1295859825061793904";

let lastPrayerTime = null;
let lastCheckTime = null;
let voiceJoinTime = null;
let isInVoice = false;

const player = createAudioPlayer();

app.get("/", (_, res) => {
  if (!client.user) return res.send("البوت لم يسجل الدخول بعد.");

  const user = client.user;
  const avatar = user.displayAvatarURL();
  const username = user.username;
  const id = user.id;

  const now = Date.now();

  const prayerNext = lastPrayerTime ? new Date(lastPrayerTime.getTime() + 10 * 60 * 1000) : null;
  const checkNext = lastCheckTime ? new Date(lastCheckTime.getTime() + 5000) : null;

  res.send(`
    <body style="background:#111;color:white;text-align:center;font-family:sans-serif">
      <h1 style="color:#0f0">البوت شغال 24 ساعة</h1>
      <img src="${avatar}" width="128" style="border-radius:50%"><br><br>
      <div><strong>يوزر:</strong> ${username}#${user.discriminator}</div>
      <div><strong>ID:</strong> <span id="uid">${id}</span>
        <button onclick="copyID()">نسخ</button>
      </div><br>

      <div><strong>آخر دعاء:</strong> ${lastPrayerTime ? lastPrayerTime.toLocaleTimeString() : "—"}</div>
      <div><strong>باقي للدعاء الجاي:</strong> ${prayerNext ? timeUntil(prayerNext) : "—"}</div>
      <hr style="margin:10px 0">
      <div><strong>آخر تحقق من الروم:</strong> ${lastCheckTime ? lastCheckTime.toLocaleTimeString() : "—"}</div>
      <div><strong>باقي للتحقق القادم:</strong> ${checkNext ? timeUntil(checkNext) : "—"}</div>
      <div><strong>مدة البقاء في الروم:</strong> ${voiceJoinTime && isInVoice ? formatDuration(now - voiceJoinTime) : "مو في الروم"}</div>
      <div><strong>الحالة:</strong> ${isInVoice ? "<span style='color:#0f0'>في الروم</span>" : "<span style='color:red'>مو في الروم</span>"}</div>

      <br><a href="/join"><button style="padding:10px 20px;font-size:16px;">دخول الروم الصوتي</button></a>
      <script>
        function copyID() {
          const id = document.getElementById('uid').innerText;
          navigator.clipboard.writeText(id);
          alert("تم نسخ ID");
        }
      </script>
    </body>
  `);
});

app.get("/join", async (_, res) => {
  await joinVoice(VOICE_ROOM);
  res.send("تم دخول الروم الصوتي.");
});

app.listen(process.env.PORT || 2000, () => console.log("البوت يعمل"));

client.on("ready", () => {
  console.log(`${client.user.username} جاهز`);

  // دعاء كل 10 دقائق
  setInterval(() => {
    const channel = client.channels.cache.get(TEXT_ROOM);
    if (channel) {
      channel.send(`**${shuffledPrayers[prayerIndex]}**`);
      prayerIndex = (prayerIndex + 1) % shuffledPrayers.length;
      if (prayerIndex === 0) shuffledPrayers = prayers.sort(() => Math.random() - 0.5);
      lastPrayerTime = new Date();
    }
  }, 10 * 60 * 1000);

  // تحقق كل 5 ثواني إذا مو في الروم يدخله
  setInterval(async () => {
    const guild = client.guilds.cache.get(VOICE_ROOM.guildId);
    const me = guild?.members.cache.get(client.user.id);
    const inVoice = me?.voice.channelId === VOICE_ROOM.channelId;

    lastCheckTime = new Date();

    if (!inVoice) {
      console.log("مو بالروم، بدخل الحين");
      await joinVoice(VOICE_ROOM);
    } else {
      isInVoice = true;
    }
  }, 5000); // كل 5 ثواني
});

async function joinVoice({ guildId, channelId }) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;

  const connection = joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

  voiceJoinTime = Date.now();
  isInVoice = true;

  try {
    const stream = await play.stream("https://www.youtube.com/live/fpxO9PF1ous?si=-2-nKsQNVNFgzsPH");
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      console.log("البث انتهى أو توقف.");
    });

    player.on("error", error => {
      console.error("خطأ في مشغل الصوت:", error);
    });
  } catch (error) {
    console.error("خطأ في تشغيل البث:", error);
  }
}

function timeUntil(date) {
  const diff = date - Date.now();
  if (diff <= 0) return "الآن";
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes} دقيقة و ${seconds} ثانية`;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
}

client.login(process.env.token);
