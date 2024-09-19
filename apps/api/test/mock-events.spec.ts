import { PrismaService } from '@app/db';
import { init } from '@paralleldrive/cuid2';
import {
  EventAnalyticsEvents,
  EventType,
  Gender,
  Prisma,
  PrismaClient,
  Role,
  Users,
} from '@prisma/client';

const eID = init({ length: 64 });
const genders = ['male', 'female', 'unknown'];
const eventTypes = ['attend', 'unattend', 'comment', 'favorite', 'unfavorite'];

const nextInt = (max: number) => Math.floor(Math.random() * max);

function generateUser() {
  return {
    id: eID(),
    email: eID() + '@example.com',
    password: '123',
    role: 'user' as Role,
    gender: genders[nextInt(3)] as Gender,
    birthdate: new Date(Date.now() - nextInt(1000 * 60 * 60 * 24 * 366 * 20)),
  };
}

function generateAnalyticsEvent(params: {
  eventId: string;
  birthdate: Date;
  gender: Gender;
}) {
  const { eventId, birthdate: userBirthdate, gender: userGender } = params;
  return {
    id: eID(),
    eventId,
    userBirthdate,
    userGender,
    userLatitude: nextInt(50),
    userLongitude: nextInt(50),
    eventType: eventTypes[nextInt(5)] as EventType,
    createdAt: new Date(
      Date.now() -
        nextInt(1000 * 60 * 60 * 24 * 366 * 20) +
        2 * nextInt(1000 * 60 * 60 * 24 * 366 * 20),
    ),
  };
}

describe('Mock events', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    prisma.$connect();
  });

  test('Mock events', async () => {
    const users = await prisma.users.createManyAndReturn({
      data: Array.from({ length: 1_000 }, () => generateUser()),
      select: { birthdate: true, gender: true, id: true },
    });

    for (const user of users) {
      await prisma.users.update({
        where: { id: user.id },
        data: { attends: { connect: { id: 'r3hi6tshtehf3qf1' } } },
      });
    }

    const mock = Array.from({ length: 100_000 }, () =>
      generateAnalyticsEvent({
        eventId: 'r3hi6tshtehf3qf1',
        ...users[nextInt(1000)],
      }),
    );

    await prisma.eventAnalyticsEvents.createMany({
      data: mock,
    });
  }, 10000000);
});
