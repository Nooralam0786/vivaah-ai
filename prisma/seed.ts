/**
 * Seed script — populates the local SQLite DB with a demo account + sample
 * matches/conversations so the dashboard isn't empty on first run.
 *
 * Run with: npm run db:seed
 * Demo login: rohan@example.com / Password123!
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Password123!';

const CANDIDATES = [
  {
    fullName: 'Ananya Singh',
    email: 'ananya@example.com',
    phone: '9810000001',
    age: 27,
    profession: 'Product Manager',
    location: 'Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    religion: 'Hindu',
    caste: 'Singh',
    height: "5'5\"",
    income: '10–20L',
    matchPercent: 95,
    isOnline: true,
    isVerified: true,
    tag: 'new',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    interests: ['Travel', 'Reading', 'Yoga'],
  },
  {
    fullName: 'Neha Gupta',
    email: 'neha@example.com',
    phone: '9810000002',
    age: 26,
    profession: 'UX Designer',
    location: 'Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    religion: 'Hindu',
    caste: 'Gupta',
    height: "5'4\"",
    income: '5–10L',
    matchPercent: 92,
    isOnline: false,
    isVerified: true,
    tag: 'new',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80',
    interests: ['Music', 'Art'],
  },
  {
    fullName: 'Pooja Sharma',
    email: 'pooja@example.com',
    phone: '9810000003',
    age: 28,
    profession: 'Software Engineer',
    location: 'Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    religion: 'Hindu',
    caste: 'Sharma',
    height: "5'3\"",
    income: '10–20L',
    matchPercent: 90,
    isOnline: true,
    isVerified: true,
    tag: 'compatible',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    interests: ['Coding', 'Movies'],
  },
  {
    fullName: 'Ishita Verma',
    email: 'ishita@example.com',
    phone: '9810000004',
    age: 27,
    profession: 'Chartered Accountant',
    location: 'Pune',
    city: 'Pune',
    state: 'Maharashtra',
    religion: 'Hindu',
    caste: 'Verma',
    height: "5'2\"",
    income: '5–10L',
    matchPercent: 88,
    isOnline: false,
    isVerified: true,
    tag: 'compatible',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80',
    interests: ['Finance', 'Cooking'],
  },
  {
    fullName: 'Kavya Reddy',
    email: 'kavya@example.com',
    phone: '9810000005',
    age: 26,
    profession: 'Software Engineer',
    location: 'Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    religion: 'Hindu',
    caste: 'Reddy',
    height: "5'5\"",
    income: '10–20L',
    matchPercent: 94,
    isOnline: true,
    isVerified: true,
    tag: 'mutual',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80',
    interests: ['Tech', 'Yoga'],
  },
  {
    fullName: 'Nisha Rao',
    email: 'nisha@example.com',
    phone: '9810000006',
    age: 29,
    profession: 'Data Scientist',
    location: 'Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    religion: 'Hindu',
    caste: 'Rao',
    height: "5'5\"",
    income: '20L+',
    matchPercent: 85,
    isOnline: true,
    isVerified: true,
    tag: 'premium',
    photo: 'https://images.unsplash.com/photo-1535090333275-02e76c6777b0?w=300&q=80',
    interests: ['AI', 'Reading'],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const me = await prisma.user.upsert({
    where: { email: 'rohan@example.com' },
    update: {},
    create: {
      fullName: 'Rohan Sharma',
      email: 'rohan@example.com',
      phone: '9876543210',
      passwordHash,
      phoneVerified: true,
      profile: {
        create: {
          gender: 'Male',
          dob: '1995-06-15',
          height: "5'10\"",
          religion: 'Hindu',
          caste: 'Brahmin',
          motherTongue: 'Hindi',
          maritalStatus: 'Never Married',
          qualification: 'B.Tech/B.E.',
          occupation: 'Software Engineer',
          company: 'Tech Corp',
          annualIncome: '20–40 LPA',
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
          aboutMe:
            "I am a passionate software engineer who loves to travel and explore new cultures. Family-oriented and looking for a like-minded partner to share life's beautiful journey.",
          interests: JSON.stringify(['Travel', 'Coding', 'Yoga', 'Music']),
          isVerified: true,
        },
      },
    },
  });

  for (const c of CANDIDATES) {
    const candidatePasswordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        fullName: c.fullName,
        email: c.email,
        phone: c.phone,
        passwordHash: candidatePasswordHash,
        phoneVerified: true,
        profile: {
          create: {
            occupation: c.profession,
            city: c.city,
            state: c.state,
            religion: c.religion,
            caste: c.caste,
            height: c.height,
            annualIncome: c.income,
            country: 'India',
            photo: c.photo,
            interests: JSON.stringify(c.interests),
            isVerified: c.isVerified,
            isOnline: c.isOnline,
          },
        },
      },
    });

    await prisma.match.upsert({
      where: { userAId_userBId: { userAId: me.id, userBId: user.id } },
      update: {},
      create: {
        userAId: me.id,
        userBId: user.id,
        matchPercent: c.matchPercent,
        tag: c.tag,
      },
    });

    if (c.tag === 'mutual' || c.tag === 'new') {
      await prisma.like.upsert({
        where: { fromUserId_toUserId: { fromUserId: user.id, toUserId: me.id } },
        update: {},
        create: { fromUserId: user.id, toUserId: me.id },
      });
    }
  }

  // Seed a couple of conversations with sample messages
  const ananya = await prisma.user.findUniqueOrThrow({ where: { email: 'ananya@example.com' } });
  const neha = await prisma.user.findUniqueOrThrow({ where: { email: 'neha@example.com' } });

  const convoWithAnanya = await prisma.conversation.upsert({
    where: { userAId_userBId: { userAId: me.id, userBId: ananya.id } },
    update: {},
    create: { userAId: me.id, userBId: ananya.id },
  });

  const ananyaMessages = await prisma.message.count({ where: { conversationId: convoWithAnanya.id } });
  if (ananyaMessages === 0) {
    await prisma.message.createMany({
      data: [
        { conversationId: convoWithAnanya.id, senderId: ananya.id, text: 'Hey! I saw your profile and I think we have a lot in common 😊' },
        { conversationId: convoWithAnanya.id, senderId: me.id, text: "Hi Ananya! Yes, I noticed too. You're also into yoga and travel?" },
        { conversationId: convoWithAnanya.id, senderId: ananya.id, text: 'Yes! I love backpacking across Himachal. Have you been to Kasol?' },
        { conversationId: convoWithAnanya.id, senderId: me.id, text: "I've been to Kheerganga! Kasol is on my list. Maybe we can plan a trip with family someday 😄" },
        { conversationId: convoWithAnanya.id, senderId: ananya.id, text: 'That’s so cool! Are you free for a call this weekend?' },
      ],
    });
  }

  const convoWithNeha = await prisma.conversation.upsert({
    where: { userAId_userBId: { userAId: me.id, userBId: neha.id } },
    update: {},
    create: { userAId: me.id, userBId: neha.id },
  });

  const nehaMessages = await prisma.message.count({ where: { conversationId: convoWithNeha.id } });
  if (nehaMessages === 0) {
    await prisma.message.createMany({
      data: [
        { conversationId: convoWithNeha.id, senderId: neha.id, text: "Hi! I read your profile bio and it's really thoughtful" },
        { conversationId: convoWithNeha.id, senderId: me.id, text: 'Thank you! I try to be genuine. Your design work looks amazing btw' },
        { conversationId: convoWithNeha.id, senderId: neha.id, text: 'That’s amazing! I love traveling too' },
      ],
    });
  }

  console.log('Seed complete.');
  console.log('Demo login: rohan@example.com / ' + DEMO_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
