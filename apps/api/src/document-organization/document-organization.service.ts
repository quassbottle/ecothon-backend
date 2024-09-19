import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/db';
import { DocumentNotFoundException } from './exceptions/document-not-found.exception';
import { DocumentsCreateDto } from './dto/documents-create.dto';
import { UserNotFoundException } from '@app/common/errors/users/user.not-found.exception';
import { DocumentEditDto } from './dto/document-edit.dto';
import { PostModel } from '../posts/models/post.model';

@Injectable()
export class DocumentOrganizationService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    @Inject('DOCUMENT_ID') private readonly documentId: () => string,
  ) {}

  async getExternalDocument(taxId: string) {
    const url = new URL('https://api-fns.ru/api/search');
    url.searchParams.append('q', taxId);
    url.searchParams.append('key', this.config.get<string>('FNS_TOKEN'));

    const res = await this.http.axiosRef.get<OrganizationResponse>(
      url.toString(),
    );
    const orgResponse = res.data as OrganizationResponse;

    return orgResponse.Count ? orgResponse.items[0] : { ЮЛ: null };
  }

  async getDocument(id: string) {
    const candidate = await this.prisma.document.findFirst({ where: { id } });
    if (!candidate) {
      throw new DocumentNotFoundException();
    }

    return candidate;
  }

  async findAll(params: { limit?: number; offset?: number }) {
    const { limit, offset } = params;

    return this.prisma.document.findMany({
      take: limit ?? 10,
      skip: offset ?? 0
    });
  }

  async editDocument(params: { data: DocumentEditDto }) {
    const { data } = params;
    const candidate = await this.prisma.document.findFirst({
      where: { id: data.id },
    });
    if (!candidate) {
      throw new DocumentNotFoundException();
    }

    await this.prisma.document.update({
      where: { id: data.id },
      data: { documentType: data.documentType },
    });
    return candidate;
  }

  async createDocument(params: { data: DocumentsCreateDto }) {
    const { data } = params;

    const user = await this.prisma.users.findFirst({
      where: { id: data.userId },
    });

    const document = await this.prisma.file.findFirst({where: {id: data.fileId}});

    if (!document) {
      throw new BadRequestException();
    }

    if (!user) {
      throw new UserNotFoundException(data.userId);
    }

    return this.prisma.document.create({
      data: { ...data, id: this.documentId(), documentType: "unverified" },
    });
  }
}
