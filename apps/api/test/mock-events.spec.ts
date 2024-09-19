import { PrismaService } from '@app/db';
import { init } from '@paralleldrive/cuid2';
import { AgeRating, EventType, Gender, Role } from '@prisma/client';
import { EventsService } from '../src/events/events.service';
import { TagsService } from '../src/tags/tags.service';

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
  let eventsService: EventsService;
  let tagsService: TagsService;

  beforeAll(async () => {
    prisma = new PrismaService();
    prisma.$connect();

    tagsService = new TagsService(prisma, eID);
    eventsService = new EventsService(
      prisma,
      null,
      tagsService,
      null,
      null,
      eID,
    );
  });

  // test('Mock analytics', async () => {
  //   const users = await prisma.users.createManyAndReturn({
  //     data: Array.from({ length: 1_000 }, () => generateUser()),
  //     select: { birthdate: true, gender: true, id: true },
  //   });

  //   for (const user of users) {
  //     await prisma.users.update({
  //       where: { id: user.id },
  //       data: { attends: { connect: { id: 'r3hi6tshtehf3qf1' } } },
  //     });
  //   }

  //   const mock = Array.from({ length: 100_000 }, () =>
  //     generateAnalyticsEvent({
  //       eventId: 'r3hi6tshtehf3qf1',
  //       ...users[nextInt(1000)],
  //     }),
  //   );

  //   await prisma.eventAnalyticsEvents.createMany({
  //     data: mock,
  //   });
  // }, 10000000);

  test('Mock Events', async () => {
    const eventData = [
      {
        name: 'Посадка деревьев в парке "Сокольники"',
        description:
          'Присоединяйтесь к акции по посадке деревьев в парке "Сокольники", чтобы улучшить экологию города.',
        startDate: new Date('2024-09-22T10:00:00.000Z'),
        location: 'Москва, Парк "Сокольники"',
        ageRating: AgeRating.six,
        bannerUrl:
          'https://s3.timeweb.cloud/c682ec52-c9a44753-1274-459e-a8c2-4a6a310b5f93/dhudfxkp2yut83iyh7813twehncbaxgu',
        latitude: 55.794229,
        longitude: 37.679829,
        tags: ['экология', 'посадка деревьев', 'Москва', 'активизм'],
        authorId: 'lz0aaa9ex4m9hrhu',
      },
      {
        name: 'Очистка берега Москвы-реки',
        description:
          'Помогите очистить берег Москвы-реки от мусора и восстановить его природную красоту.',
        startDate: new Date('2024-10-15T09:00:00.000Z'),
        location: 'Москва, Берег Москвы-реки',
        ageRating: AgeRating.twelve,
        bannerUrl: 'https://bigtrip.by/storage/organizations/1071/1ml5cjqf.jpg',
        latitude: 55.755826,
        longitude: 37.6173,
        tags: ['экология', 'Москва-река', 'очистка', 'волонтерство'],
        authorId: 'lz0aaa9ex4m9hrhu',
      },
      {
        name: 'Экологический фестиваль "Зеленая Москва"',
        description:
          'Участвуйте в фестивале, посвященном экологическим проектам и инициативам в столице.',
        startDate: new Date('2024-06-10T12:00:00.000Z'),
        location: 'Москва, ВДНХ',
        ageRating: AgeRating.sixteen,
        bannerUrl:
          'https://avatars.mds.yandex.net/get-altay/10156117/2a0000018d31394a10fb8bd058838b65f1bf/XXL_height',
        latitude: 55.828804,
        longitude: 37.633377,
        tags: [
          'экология',
          'фестиваль',
          'Москва',
          'ВДНХ',
          'экологический проект',
        ],

        authorId: 'lz0aaa9ex4m9hrhu',
      },
      {
        name: 'Лекция "Устойчивое развитие городов"',
        description:
          'Присоединяйтесь к лекции экспертов, где обсуждаются пути устойчивого развития Москвы.',
        startDate: new Date('2025-01-22T14:00:00.000Z'),
        location: 'Москва, МГУ',
        ageRating: AgeRating.eighteen,
        bannerUrl:
          'https://images.adsttc.com/media/images/56d9/468a/e58e/cec9/d300/0045/large_jpg/IMG_6000.jpg?1457079930',
        latitude: 55.703297,
        longitude: 37.530887,
        tags: ['экология', 'устойчивое развитие', 'Москва', 'лекция'],
        authorId: 'lz0aaa9ex4m9hrhu',
      },
    ];

    // Создаем события и добавляем соответствующие тэги
    for (const event of eventData) {
      await eventsService.create({ data: event });
    }
  });
});
