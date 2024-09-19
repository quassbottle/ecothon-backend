import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/db';
import { DocumentNotFoundException } from '../comments/exceptions/document-not-found.exception';
import { DocumentsCreateDto } from './dto/documents-create.dto';

@Injectable()
export class DocumentOrganizationService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
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

  // async createDocument(params: { data: DocumentsCreateDto }) {
  //   const { data } = params;

  //   return this.prisma.document.create({
  //     data: { ...data },
  //   });
  // }
}
