import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/db';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async getFileById(fileId: string) {
    return (await this.prisma.file.findFirst({
      where: { id: fileId },
      select: { url: true },
    }))?.url ?? null
  }
}
