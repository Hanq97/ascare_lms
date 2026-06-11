/* ============================================================
 *  ASCare LMS — Prisma seed
 *  Chuyển mock data (design data.jsx) thành dữ liệu thật.
 *  Chạy: npm run db:seed  (sau khi prisma migrate)
 *
 *  Mật khẩu demo cho mọi tài khoản: SEED_PASSWORD (mặc định "Care@2026").
 *  Đăng nhập bằng EMAIL. Tiến độ (ViewLog) tái tạo từ `prog` trong design.
 * ============================================================ */
import { PrismaClient, AccountStatus, CourseStatus, CreatorType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** "m:ss" -> giây */
const sec = (d: string) => d.split(":").reduce((a, b) => a * 60 + Number(b), 0);

// ---------- COURSES + VIDEOS (9 コース) ----------
type V = { t: string; d: string; detail?: string };
type C = {
  id: string;
  title: string;
  desc: string;
  status: CourseStatus;
  order: number;
  videos: V[];
};

const COURSES: C[] = [
  {
    id: "c1",
    title: "食事介助の基本",
    status: "PUBLISHED",
    order: 1,
    desc: "安全な食事介助の手順、誤嚥防止、姿勢の調整までを動画で学びます。",
    videos: [
      { t: "オリエンテーション：食事介助とは", d: "4:12" },
      { t: "食事前の準備と環境づくり", d: "6:30" },
      { t: "正しい姿勢のとり方", d: "5:48" },
      { t: "誤嚥（ごえん）を防ぐポイント", d: "7:05" },
      { t: "スプーンの使い方・一口の量", d: "5:20" },
      { t: "水分補給ととろみの付け方", d: "6:14" },
      { t: "嚥下（えんげ）の確認方法", d: "4:55" },
      { t: "食後のケアと口腔ケア", d: "6:40" },
      { t: "よくある事故とその対応", d: "8:02" },
      { t: "まとめ・確認クイズ解説", d: "5:10" },
    ],
  },
  {
    id: "c2",
    title: "入浴介助",
    status: "PUBLISHED",
    order: 2,
    desc: "全身浴・部分浴・清拭の手順と、ヒヤリハットを防ぐ安全管理。",
    videos: [
      { t: "入浴介助の目的と注意点", d: "5:30" },
      { t: "バイタルチェックと体調確認", d: "6:10" },
      { t: "脱衣・移動の介助", d: "7:20" },
      { t: "洗身・洗髪の手順", d: "8:15" },
      { t: "浴室での安全管理", d: "6:45" },
      { t: "清拭（せいしき）の方法", d: "7:00" },
      { t: "入浴後のケア", d: "5:25" },
      { t: "事故防止とまとめ", d: "6:05" },
    ],
  },
  {
    id: "c3",
    title: "排泄介助",
    status: "PUBLISHED",
    order: 3,
    desc: "尊厳を守る排泄ケア、おむつ交換、トイレ誘導の基本。",
    videos: [
      { t: "排泄介助の心構え", d: "4:40" },
      { t: "トイレへの誘導と見守り", d: "6:20" },
      { t: "おむつ交換の手順", d: "7:50" },
      { t: "皮膚トラブルの予防", d: "5:35" },
      { t: "プライバシーへの配慮", d: "4:15" },
      { t: "まとめ・記録のポイント", d: "5:00" },
    ],
  },
  {
    id: "c4",
    title: "移乗・移動介助",
    status: "PUBLISHED",
    order: 4,
    desc: "ボディメカニクスを活かした負担の少ない移乗・車椅子介助。",
    videos: [
      { t: "ボディメカニクスの基本", d: "6:00" },
      { t: "ベッドから車椅子への移乗", d: "8:30" },
      { t: "車椅子の操作と安全", d: "6:50" },
      { t: "歩行介助のポイント", d: "7:10" },
      { t: "立ち上がりの介助", d: "5:45" },
      { t: "福祉用具の活用", d: "6:25" },
      { t: "腰痛予防とまとめ", d: "5:30" },
    ],
  },
  {
    id: "c5",
    title: "認知症ケア入門",
    status: "PUBLISHED",
    order: 5,
    desc: "認知症の理解と、利用者に寄り添うコミュニケーションの基本。",
    videos: [
      { t: "認知症とは何か", d: "6:30" },
      { t: "中核症状と行動・心理症状", d: "7:40" },
      { t: "パーソン・センタード・ケア", d: "8:00" },
      { t: "言葉かけ・傾聴の技術", d: "6:15" },
      { t: "不安・興奮への対応", d: "7:20" },
      { t: "徘徊・帰宅願望への対応", d: "6:50" },
      { t: "家族との連携", d: "5:40" },
      { t: "事例で学ぶ対応", d: "8:25" },
      { t: "まとめ", d: "4:50" },
    ],
  },
  {
    id: "c6",
    title: "介護記録の書き方",
    status: "PUBLISHED",
    order: 6,
    desc: "客観的で伝わる介護記録の書き方と、申し送りの基本。",
    videos: [
      { t: "介護記録の目的", d: "5:00" },
      { t: "事実と所見の書き分け", d: "6:20" },
      { t: "5W1Hで書く", d: "5:45" },
      { t: "申し送りのポイント", d: "6:00" },
      { t: "よくある記録の誤り", d: "5:30" },
    ],
  },
  {
    id: "c7",
    title: "感染対策の基礎",
    status: "PUBLISHED",
    order: 7,
    desc: "標準予防策、手指衛生、感染症発生時の対応を学びます。",
    videos: [
      { t: "標準予防策とは", d: "5:50" },
      { t: "正しい手洗い・手指消毒", d: "6:30" },
      { t: "手袋・マスクの着脱", d: "6:10" },
      { t: "嘔吐物の処理", d: "7:00" },
      { t: "感染症発生時の対応", d: "6:40" },
      { t: "まとめ", d: "4:30" },
    ],
  },
  {
    id: "c8",
    title: "日本語：介護の現場会話",
    status: "PUBLISHED",
    order: 8,
    desc: "挨拶・声かけ・報告など、介護現場で使う実践的な日本語。",
    videos: [
      { t: "あいさつと自己紹介", d: "5:20" },
      { t: "利用者への声かけ", d: "6:00" },
      { t: "体調をたずねる表現", d: "5:40" },
      { t: "先輩への報告・連絡・相談", d: "6:30" },
      { t: "数字・時間・日付", d: "5:10" },
      { t: "身体の名称", d: "5:50" },
      { t: "食事に関する言葉", d: "5:30" },
      { t: "入浴・排泄に関する言葉", d: "6:00" },
      { t: "緊急時の表現", d: "6:20" },
      { t: "敬語の基本", d: "7:00" },
      { t: "電話対応", d: "6:40" },
      { t: "まとめ・ロールプレイ", d: "7:30" },
    ],
  },
  {
    id: "c9",
    title: "看取りケアの基礎",
    status: "DRAFT",
    order: 9,
    desc: "終末期にある利用者への寄り添い方と、ご家族への支援の基本を学びます。（準備中）",
    videos: [
      { t: "看取りケアとは", d: "6:10" },
      { t: "終末期の身体の変化", d: "7:30" },
      { t: "痛み・苦痛の緩和", d: "6:50" },
      { t: "ご家族への支援と声かけ", d: "6:20" },
      { t: "多職種との連携", d: "5:40" },
      { t: "まとめ", d: "4:30" },
    ],
  },
];

// ---------- CORPORATIONS (5 法人) ----------
type Corp = {
  id: string;
  name: string;
  kana: string;
  person: string;
  personKana: string;
  email: string;
  phone: string;
  postal: string;
  address: string;
  status: AccountStatus;
};
const CORPS: Corp[] = [
  {
    id: "corp1",
    name: "さくら介護サービス株式会社",
    kana: "サクラカイゴサービス",
    person: "田中 美咲",
    personKana: "タナカ ミサキ",
    phone: "03-1234-5678",
    email: "info@sakura-kaigo.co.jp",
    postal: "160-0023",
    address: "東京都新宿区西新宿2-8-1",
    status: "ACTIVE",
  },
  {
    id: "corp2",
    name: "みらいケアグループ",
    kana: "ミライケアグループ",
    person: "佐々木 健",
    personKana: "ササキ ケン",
    phone: "06-9876-5432",
    email: "contact@mirai-care.jp",
    postal: "530-0001",
    address: "大阪府大阪市北区梅田1-1-3",
    status: "ACTIVE",
  },
  {
    id: "corp3",
    name: "あおぞら福祉会",
    kana: "アオゾラフクシカイ",
    person: "山本 直子",
    personKana: "ヤマモト ナオコ",
    phone: "052-111-2222",
    email: "office@aozora-fukushi.or.jp",
    postal: "460-0008",
    address: "愛知県名古屋市中区栄3-5-12",
    status: "ACTIVE",
  },
  {
    id: "corp4",
    name: "ひまわり介護センター",
    kana: "ヒマワリカイゴセンター",
    person: "中村 翔太",
    personKana: "ナカムラ ショウタ",
    phone: "092-333-4444",
    email: "info@himawari-care.jp",
    postal: "812-0011",
    address: "福岡県福岡市博多区博多駅前2-1-1",
    status: "INACTIVE", // 無効 → 学生 trực thuộc (s11) không login được (cascade)
  },
  {
    id: "corp5",
    name: "こもれび訪問介護",
    kana: "コモレビホウモンカイゴ",
    person: "小川 涼",
    personKana: "オガワ リョウ",
    phone: "011-555-7788",
    email: "info@komorebi-care.jp",
    postal: "060-0042",
    address: "北海道札幌市中央区大通西5-1",
    status: "ACTIVE",
  }, // không có 学生
];

// ---------- STUDENTS (11 学生) ----------
type Stu = {
  id: string;
  corpId: string;
  name: string;
  kana: string;
  country: string;
  status: AccountStatus;
  prog: Record<string, number>;
};
const STUDENTS: Stu[] = [
  {
    id: "s1",
    corpId: "corp1",
    name: "グエン・ヴァン・アン",
    kana: "Nguyen Van Anh",
    country: "ベトナム",
    status: "ACTIVE",
    prog: { c1: 10, c2: 8, c3: 6, c4: 5, c5: 3, c6: 5, c7: 6 },
  },
  {
    id: "s2",
    corpId: "corp1",
    name: "チャン・ティ・フォン",
    kana: "Tran Thi Phuong",
    country: "ベトナム",
    status: "ACTIVE",
    prog: { c1: 10, c2: 6, c3: 6, c4: 2, c5: 1, c6: 3, c7: 4 },
  },
  {
    id: "s3",
    corpId: "corp1",
    name: "レ・ヴァン・ミン",
    kana: "Le Van Minh",
    country: "ベトナム",
    status: "ACTIVE",
    prog: { c1: 7, c2: 3, c3: 2, c4: 0, c5: 0, c6: 1, c7: 2 },
  },
  {
    id: "s4",
    corpId: "corp1",
    name: "ファム・ティ・ガー",
    kana: "Pham Thi Nga",
    country: "ベトナム",
    status: "ACTIVE",
    prog: { c1: 4, c2: 1, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0 },
  },
  {
    id: "s5",
    corpId: "corp2",
    name: "スリ・ワヤン",
    kana: "Sri Wayan",
    country: "インドネシア",
    status: "ACTIVE",
    prog: { c1: 10, c2: 8, c3: 6, c4: 7, c5: 9, c6: 5, c7: 6 },
  },
  {
    id: "s6",
    corpId: "corp2",
    name: "アグン・プトラ",
    kana: "Agung Putra",
    country: "インドネシア",
    status: "ACTIVE",
    prog: { c1: 10, c2: 8, c3: 5, c4: 4, c5: 5, c6: 5, c7: 3 },
  },
  {
    id: "s7",
    corpId: "corp2",
    name: "デウィ・サリ",
    kana: "Dewi Sari",
    country: "インドネシア",
    status: "ACTIVE",
    prog: { c1: 6, c2: 2, c3: 1, c4: 0, c5: 2, c6: 0, c7: 1 },
  },
  {
    id: "s8",
    corpId: "corp3",
    name: "ミャ・テッ",
    kana: "Mya Thet",
    country: "ミャンマー",
    status: "ACTIVE",
    prog: { c1: 8, c2: 5, c3: 3, c4: 2, c5: 1, c6: 2, c7: 3 },
  },
  {
    id: "s9",
    corpId: "corp3",
    name: "アウン・コー",
    kana: "Aung Ko",
    country: "ミャンマー",
    status: "ACTIVE",
    prog: { c1: 3, c2: 1, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0 },
  },
  {
    id: "s10",
    corpId: "corp3",
    name: "ティリ・ウィン",
    kana: "Thiri Win",
    country: "ミャンマー",
    status: "INACTIVE",
    prog: { c1: 2, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0 },
  },
  {
    id: "s11",
    corpId: "corp4",
    name: "ブイ・ティ・マイ",
    kana: "Bui Thi Mai",
    country: "ベトナム",
    status: "ACTIVE",
    prog: { c1: 5, c2: 3, c3: 2, c4: 1, c5: 0, c6: 1, c7: 0 },
  },
];

// ---------- ADMINS (4 管理者) ----------
const ADMINS = [
  {
    id: "a1",
    name: "山田 太郎",
    email: "yamada@ascare.example.jp",
    status: "ACTIVE" as AccountStatus,
  },
  {
    id: "a2",
    name: "佐藤 花子",
    email: "sato@ascare.example.jp",
    status: "ACTIVE" as AccountStatus,
  },
  {
    id: "a3",
    name: "鈴木 一郎",
    email: "suzuki@ascare.example.jp",
    status: "ACTIVE" as AccountStatus,
  },
  {
    id: "a4",
    name: "高橋 恵",
    email: "takahashi@ascare.example.jp",
    status: "INACTIVE" as AccountStatus,
  },
];

// ---------- TEACHERS (3 教師) ----------
const TEACHERS = [
  {
    id: "t1",
    name: "佐藤 健一",
    nameKana: "サトウ ケンイチ",
    email: "k.sato@tokyo-kaigo.ac.jp",
    org: "東京介護福祉専門学校",
    status: "ACTIVE" as AccountStatus,
  },
  {
    id: "t2",
    name: "鈴木 美和",
    nameKana: "スズキ ミワ",
    email: "m.suzuki@osaka-care.ac.jp",
    org: "大阪福祉教育学院",
    status: "ACTIVE" as AccountStatus,
  },
  {
    id: "t3",
    name: "高田 隆",
    nameKana: "タカダ タカシ",
    email: "t.takada@nagoya-kaigo.ac.jp",
    org: "名古屋介護専門学校",
    status: "ACTIVE" as AccountStatus,
  },
];

// 作成者 mỗi コース: admin (a1/a2) hoặc teacher (t1/t2/t3). (theo design)
const COURSE_OWNER: Record<string, { type: CreatorType; id: string }> = {
  c1: { type: "ADMIN", id: "a1" },
  c2: { type: "ADMIN", id: "a1" },
  c3: { type: "ADMIN", id: "a1" },
  c4: { type: "ADMIN", id: "a2" },
  c7: { type: "ADMIN", id: "a2" },
  c5: { type: "TEACHER", id: "t1" },
  c6: { type: "TEACHER", id: "t2" },
  c8: { type: "TEACHER", id: "t3" },
  c9: { type: "TEACHER", id: "t2" },
};

const kanaToName = (kana: string) => {
  const [last = "太郎", first = ""] = kana.split(/\s+/);
  return { last, first };
};
const studentEmail = (kana: string) => kana.toLowerCase().replace(/\s+/g, ".") + "@example.jp";

async function main() {
  const pw = process.env.SEED_PASSWORD || "Care@2026";
  const passwordHash = await bcrypt.hash(pw, 10);

  // Xoá theo thứ tự phụ thuộc (idempotent)
  await prisma.viewLog.deleteMany();
  await prisma.video.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.corporation.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.auditLog.deleteMany();

  // 管理者
  for (const a of ADMINS) {
    await prisma.admin.create({
      data: {
        id: a.id,
        name: a.name,
        nameKana: a.name,
        email: a.email,
        passwordHash,
        status: a.status,
      },
    });
  }

  // 教師
  for (const t of TEACHERS) {
    await prisma.teacher.create({
      data: {
        id: t.id,
        name: t.name,
        nameKana: t.nameKana,
        email: t.email,
        org: t.org,
        passwordHash,
        status: t.status,
      },
    });
  }

  // 法人
  for (const c of CORPS) {
    await prisma.corporation.create({
      data: {
        id: c.id,
        name: c.name,
        nameKana: c.kana,
        personName: c.person,
        personKana: c.personKana,
        email: c.email,
        passwordHash,
        phone: c.phone,
        postal: c.postal,
        address: c.address,
        status: c.status,
      },
    });
  }

  // コース + 動画 (id video tái tạo đánh số v101.. như design để ổn định)
  let vid = 100;
  const courseVideoIds: Record<string, string[]> = {};
  for (const c of COURSES) {
    const ids: string[] = [];
    const owner = COURSE_OWNER[c.id];
    await prisma.course.create({
      data: {
        id: c.id,
        title: c.title,
        description: c.desc,
        status: c.status,
        order: c.order,
        thumbnailUrl: `/thumbnails/${c.id}.jpg`,
        creatorType: owner.type,
        adminId: owner.type === "ADMIN" ? owner.id : null,
        teacherId: owner.type === "TEACHER" ? owner.id : null,
        videos: {
          create: c.videos.map((v, i) => {
            const id = `v${++vid}`;
            ids.push(id);
            return {
              id,
              title: v.t,
              order: i + 1,
              durationSec: sec(v.d),
              url: `videos/${id}.mp4`,
              detail:
                v.detail ||
                `このレッスンでは「${v.t}」について、介護の現場で役立つ手順とポイントを動画で解説します。`,
            };
          }),
        },
      },
    });
    courseVideoIds[c.id] = ids;
  }

  // 学生
  for (const s of STUDENTS) {
    const { last, first } = kanaToName(s.kana);
    await prisma.student.create({
      data: {
        id: s.id,
        corpId: s.corpId,
        name: s.name,
        nameKana: `${last} ${first}`.trim(),
        email: studentEmail(s.kana),
        passwordHash,
        country: s.country,
        status: s.status,
      },
    });
  }

  // 視聴ログ — tái tạo tiến độ: done video đầu của mỗi khóa = completed 100%
  const durByVideo: Record<string, number> = {};
  for (const c of COURSES) {
    c.videos.forEach((v, i) => {
      durByVideo[courseVideoIds[c.id][i]] = sec(v.d);
    });
  }
  for (const s of STUDENTS) {
    for (const [courseId, done] of Object.entries(s.prog)) {
      const ids = courseVideoIds[courseId] || [];
      const n = Math.min(done, ids.length);
      for (let i = 0; i < n; i++) {
        const videoId = ids[i];
        const dur = durByVideo[videoId];
        await prisma.viewLog.create({
          data: {
            studentId: s.id,
            videoId,
            maxPosition: dur,
            watchedPercent: 100,
            completed: true,
          },
        });
      }
    }
  }

  const counts = {
    admins: await prisma.admin.count(),
    teachers: await prisma.teacher.count(),
    corps: await prisma.corporation.count(),
    students: await prisma.student.count(),
    courses: await prisma.course.count(),
    videos: await prisma.video.count(),
    viewLogs: await prisma.viewLog.count(),
  };
  console.log("✅ Seed xong:", counts);
  console.log(`🔑 Mật khẩu demo cho mọi tài khoản: ${pw}`);
  console.log(
    "   Login ví dụ: yamada@ascare.example.jp (admin) · k.sato@tokyo-kaigo.ac.jp (teacher)",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
