import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import { welcomeTemplate } from './templates/welcome';

@Injectable()
export class EmailNotifierService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  //{ "eventId": "swsj1iwol5vfxuuy" }
  async sendAllUsersByEventId(eventId: string) {
    const { participants, name } = await this.prisma.events.findFirst({
      where: { id: eventId },
      select: { participants: true, name: true },
    });

    console.log(
      `Notification for event ${eventId} has started (${participants.length} users)`,
    );
    console.log(join(__dirname, 'templates', 'welcome'));

    for (const user of participants) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: `БЕРЕГИ: Мероприятие "${name}" скоро начнется!`,
        html: welcomeTemplate({
          mainText: `Мероприятие "${name}" уже начнется уже через неделю! Проверь личный кабинет, чтобы узнать больше.`,
          banner: 'https://www.aspca.org/sites/default/files/catblogbanner.jpg',
          greetings: 'Привет!',
        }),
      });
    }
  }
}
