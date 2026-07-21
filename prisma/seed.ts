import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Dev/demo seed data only. Every seeded account shares this password so
// whoever is developing locally can log in as any profile below to test the
// chat / edit-profile / like flows end-to-end. Never use this for a real
// production seed.
const DEMO_PASSWORD = "Demo1234!";

async function demoUser(email: string, name: string) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash },
  });
}

const tutors = [
  {
    email: "rachel.tan@demo.70tuition.local",
    name: "Rachel Tan",
    edu: "NUS Business (Hons)",
    levels: ["Secondary", "JC"],
    subjects: ["Math", "Economics"],
    region: "Central",
    line: "Turns economics graphs from confusing to click.",
    rate: 60,
    baseLikes: 34,
    ft: true,
    gender: "Female",
    joined: new Date("2023-03-01"),
    bio: "I've been tutoring Economics and Math for six years, mostly working with students who've written the subject off as 'just not for them.' My approach is diagrams first, jargon second — once a student can draw the graph, the essay writes itself. I keep sessions conversational and low-pressure; most of my students say it feels more like office hours than tuition.",
    avail: "Weekday evenings, Sat mornings",
    mode: "Both",
  },
  {
    email: "marcus.lee@demo.70tuition.local",
    name: "Marcus Lee",
    edu: "NTU Engineering",
    levels: ["Primary", "Secondary"],
    subjects: ["Science", "Math"],
    region: "Online",
    line: "Explains science like stories, not syllabuses.",
    rate: 45,
    baseLikes: 21,
    ft: false,
    gender: "Male",
    joined: new Date("2024-01-01"),
    bio: "Part-time tutor, full-time engineer. I teach Science and Math to upper primary and lower secondary students, using real-world analogies from my day job — think circuits explained through water pipes. Patient with kids who need things repeated a few different ways before it clicks.",
    avail: "Weeknights after 7pm",
    mode: "Online",
  },
  {
    email: "priya.nair@demo.70tuition.local",
    name: "Priya Nair",
    edu: "SMU Law",
    levels: ["JC"],
    subjects: ["GP", "Literature"],
    region: "East",
    line: "Helped 12 students hit an A for GP last year.",
    rate: 70,
    baseLikes: 52,
    ft: true,
    gender: "Female",
    joined: new Date("2021-08-01"),
    bio: "General Paper is 80% structure and 20% opinion — I teach the structure so your opinions actually land. I've tutored JC1 and JC2 students for four years and built my own bank of essay outlines and comprehension drills. Also happy to help with Literature close reading if you're doing both.",
    avail: "Tue/Thu evenings, Sun afternoons",
    mode: "Physical",
  },
  {
    email: "weijie.ong@demo.70tuition.local",
    name: "Wei Jie Ong",
    edu: "SUTD",
    levels: ["Secondary"],
    subjects: ["Physics", "A Math"],
    region: "North",
    line: "Makes formulas feel like puzzles, not punishment.",
    rate: 50,
    baseLikes: 18,
    ft: false,
    gender: "Male",
    joined: new Date("2023-11-01"),
    bio: "Engineering student who still remembers hating A Math in Sec 3, so I teach the way I wish someone had taught me — work backwards from the answer to find the logic, not the other way round. Small groups or 1-1, both fine.",
    avail: "Weekends, flexible",
    mode: "Both",
  },
  {
    email: "amanda.goh@demo.70tuition.local",
    name: "Amanda Goh",
    edu: "NUS Medicine (Yr 3)",
    levels: ["Primary"],
    subjects: ["Science", "English"],
    region: "South West",
    line: "Patient with kids who hate homework (most of them).",
    rate: 40,
    baseLikes: 27,
    ft: false,
    gender: "Female",
    joined: new Date("2024-06-01"),
    bio: "Med student tutoring on the side to fund my own bubble tea addiction, but I take it seriously — I plan every session around what the child is stuck on that week rather than a fixed syllabus. Good with reluctant learners and easily distracted ones.",
    avail: "Weekday late afternoons",
    mode: "Physical",
  },
];

const students = [
  {
    email: "student1@demo.70tuition.local",
    name: "JC1 Chemistry Student",
    subject: "H2 Chemistry",
    rate: 65,
    region: "Central",
    timing: "Weekday evenings",
    freq: "1x / week",
    duration: "1.5 hr",
    genderPref: "No preference",
    school: "Raffles Institution (JC)",
    baseLikes: 14,
    bio: "JC1 student struggling with organic chemistry mechanisms specifically — okay with the rest of the syllabus. Looking for someone who can go slow on the reasoning rather than just giving me steps to memorise.",
  },
  {
    email: "student2@demo.70tuition.local",
    name: "P6 Math Student",
    subject: "Primary 6 Math",
    rate: 40,
    region: "North East",
    timing: "Weekends",
    freq: "2x / week",
    duration: "1 hr",
    genderPref: "Female tutor preferred",
    school: "Rosyth School",
    baseLikes: 9,
    bio: "PSLE this year, need help mainly with model drawing for word problems. My daughter does better with a calmer teaching style, so patience matters more than speed for us.",
  },
  {
    email: "student3@demo.70tuition.local",
    name: "Sec 4 Math Student",
    subject: "Sec 4 A Math & E Math",
    rate: 55,
    region: "Online",
    timing: "Flexible",
    freq: "1x / week",
    duration: "2 hr",
    genderPref: "No preference",
    school: "ACS (Independent)",
    baseLikes: 22,
    bio: "O Levels this year, comfortable with concepts but slow under time pressure. Want someone who can run me through timed past-year papers rather than re-teaching from scratch.",
  },
  {
    email: "student4@demo.70tuition.local",
    name: "JC Economics Student",
    subject: "JC Economics",
    rate: 60,
    region: "East",
    timing: "Friday evenings",
    freq: "1x / week",
    duration: "1.5 hr",
    genderPref: "Male tutor preferred",
    school: "Victoria Junior College",
    baseLikes: 11,
    bio: "Weak on essay structure for macro questions, case study section is fine. Would like a tutor with a marking scheme background if possible.",
  },
  {
    email: "student5@demo.70tuition.local",
    name: "Primary English Student",
    subject: "Primary English",
    rate: 35,
    region: "South",
    timing: "Saturday mornings",
    freq: "1x / week",
    duration: "1 hr",
    genderPref: "No preference",
    school: "Nan Hua Primary",
    baseLikes: 7,
    bio: "Needs help with composition writing — vocabulary is fine but struggles to structure a story with a clear beginning, middle and end.",
  },
];

const centers = [
  {
    email: "learningloft@demo.70tuition.local",
    name: "The Learning Loft",
    levels: ["Primary", "Secondary", "JC"],
    subjects: ["Math", "Science", "English"],
    region: "Central",
    line: "Small classes, big whiteboards, real conversations.",
    baseLikes: 41,
    joined: new Date("2020-02-01"),
    bio: "The Learning Loft runs small-group classes capped at six students, on the idea that a whiteboard conversation beats a lecture every time. Founded by two ex-MOE teachers, we focus on Primary through JC Math, Science and English, with monthly progress reports sent home to parents.",
    descriptor: "Founded by ex-MOE educators",
  },
  {
    email: "northpointminds@demo.70tuition.local",
    name: "Northpoint Minds",
    levels: ["Primary", "Secondary"],
    subjects: ["Math", "Science"],
    region: "North",
    line: "Where formulas finally make sense.",
    baseLikes: 19,
    joined: new Date("2022-09-01"),
    bio: "A neighbourhood tuition centre focused purely on Math and Science for Primary and Secondary students. We keep class sizes small and run a diagnostic test before enrolment so lessons are pitched at the right level from day one.",
    descriptor: "MOE-registered tuition centre",
  },
  {
    email: "harbourview@demo.70tuition.local",
    name: "Harbourview Tuition",
    levels: ["Secondary", "JC"],
    subjects: ["Economics", "GP", "Chemistry"],
    region: "East",
    line: "Serious about grades, relaxed about everything else.",
    baseLikes: 33,
    joined: new Date("2019-07-01"),
    bio: "Harbourview specialises in the subjects students dread most — Economics, GP and Chemistry at the Secondary and JC level. Our tutors are all subject specialists with at least five years of teaching experience, and we run free revision workshops before major exams.",
    descriptor: "MOE-registered tuition centre",
  },
];

async function main() {
  for (const t of tutors) {
    const user = await demoUser(t.email, t.name);
    await prisma.tutorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: t.name,
        edu: t.edu,
        levels: t.levels,
        subjects: t.subjects,
        region: t.region,
        line: t.line,
        rate: t.rate,
        ft: t.ft,
        gender: t.gender,
        avail: t.avail,
        mode: t.mode,
        bio: t.bio,
        baseLikes: t.baseLikes,
        createdAt: t.joined,
      },
    });
  }

  for (const s of students) {
    const user = await demoUser(s.email, s.name);
    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        subject: s.subject,
        rate: s.rate,
        region: s.region,
        timing: s.timing,
        freq: s.freq,
        duration: s.duration,
        genderPref: s.genderPref,
        school: s.school,
        bio: s.bio,
        baseLikes: s.baseLikes,
      },
    });
  }

  for (const c of centers) {
    const user = await demoUser(c.email, c.name);
    await prisma.center.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: c.name,
        levels: c.levels,
        subjects: c.subjects,
        region: c.region,
        line: c.line,
        descriptor: c.descriptor,
        bio: c.bio,
        baseLikes: c.baseLikes,
        createdAt: c.joined,
      },
    });
  }

  console.log(`Seed complete. Demo password for every seeded account: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
