const { Client } = require("discord.js-selfbot-v13");
const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const express = require("express");
const app = express();
const client = new Client();

const axios = require("axios");  // لطلب الردود من API خارجي
const API_KEY = "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"; // استبدل هذا بمفتاح الـ API الخاص بك
const PRAYER_ROOM_ID = "1295859806468440135";  // معرف غرفة الأدعية
const CHAT_ROOM_ID = "1295860000000000000";  // معرف غرفة السوالف
const VOICE_ROOMS = [
  { guildId: "1295847578700878026", channelId: "1295860054448148511" }  // فواز
];

// الأدعية
‏const prayers = [
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

let prayerIndex = 0;
let shuffledPrayers = prayers.sort(() => Math.random() - 0.5);

const greetings = [
  "سلام", "السلام", "سلام عليكم", "السلام عليكم", "سلام عليكم ورحمه",
  "السلام عليكم ورحمه الله", "السلام عليكم ورحمه الله", "السلام عليكم ورحمه الله وبركاته"
];
const greetingReplies = [
  "وعليكم السلام ورحمة الله وبركاته منور/ه",
  "وعليكم السلام ورحمة الله وبركاته ولكم",
  "وعليكم السلام ورحمة الله وبركاته حياك الله"
];

app.get("/", async (_, res) => {
  if (!client.user) {
    return res.send("البوت لم يسجل الدخول بعد. حاول لاحقًا.");
  }

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
      <a href="/join2"><button>دخول روم فواز</button></a>
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

app.get("/join2", (_, res) => {
  joinVoice(VOICE_ROOMS[0]);
  res.send("تم دخول روم فواز");
});

app.listen(process.env.PORT || 2000, () => console.log("Ready 24H"));

client.on("ready", () => {
  console.log(`${client.user.username} is ready!`);

  setInterval(() => {
    const prayerRoom = client.channels.cache.get(PRAYER_ROOM_ID);
    if (prayerRoom) {
      prayerRoom.send(`**${shuffledPrayers[prayerIndex]}**`);
      prayerIndex = (prayerIndex + 1) % shuffledPrayers.length;
      if (prayerIndex === 0) shuffledPrayers = prayers.sort(() => Math.random() - 0.5);
    }
  }, 5 * 60 * 1000); // كل 5 دقايق

  setInterval(() => {
    VOICE_ROOMS.forEach(room => {
      const conn = getVoiceConnection(room.guildId);
      if (!conn || conn.joinConfig.channelId !== room.channelId) {
        joinVoice(room);
      }
    });
  }, 5000);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.id === client.user.id) return;

  // إذا كانت الرسالة في غرفة الأدعية
  if (msg.channel.id === PRAYER_ROOM_ID) {
    // لا يجب أن نرد على الرسائل في غرفة الأدعية
    return;
  }

  // إذا كانت الرسالة في غرفة السوالف
  if (msg.channel.id === CHAT_ROOM_ID) {
    const content = msg.content.toLowerCase();

    // ردود التحية
    if (greetings.includes(content)) {
      const reply = greetingReplies[Math.floor(Math.random() * greetingReplies.length)];
      msg.reply(reply);
    }

    // ردود عامة
    if (content === "برب") msg.reply("تيت موفق/ه لاتتاخر/ي");
    if (content === "باك") msg.reply("ولكم باك");

    // منع طلبات الأكواد والمواقع
    if (content.includes("كود") || content.includes("موقع") || content.includes("تطبيق")) {
      msg.reply("عذرًا، ما أقدر أساعد في هالشيء.");
    }

    // الرد على المحادثات غير اللائقة
    if (content.includes("كلام غير لائق") || content.includes("ألفاظ سيئة")) {
      msg.reply("عيب عليك، حاول تتكلم بأسلوب لائق.");
    }

    // التفاعل مع الذكاء الاصطناعي
    if (content) {
      const reply = await getAIResponse(content);
      msg.reply(reply);
    }
  }
});

function joinVoice({ guildId, channelId }) {
  const connection = getVoiceConnection(guildId);
  if (connection && connection.joinConfig.channelId === channelId) return;

  joinVoiceChannel({
    channelId,
    guildId,
    adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator,
    selfDeaf: false,
    selfMute: true,
  });
}

async function getAIResponse(content) {
  const prompt = `انت شخص اسمه وليد، عمرك 17 سنة، من الكويت، وتتكلم باللهجة العامية. تتعامل مع الناس بشكل طبيعي، وترد عليهم بطريقة لبقة. رد على هذا الشخص بناءً على الكلام التالي: "${content}"`;

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',  // استخدم GPT-3 أو أي نموذج تفضله
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
      n: 1,
      stop: ["\n"]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "عذرًا، حصل خطأ.";
  }
}

client.login(process.env.token);
