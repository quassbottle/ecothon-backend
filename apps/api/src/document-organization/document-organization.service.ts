import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentOrganizationService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getDocument(taxId: string) {
    const url = new URL('https://api-fns.ru/api/search');
    url.searchParams.append('q', taxId);
    url.searchParams.append('key', this.config.get<string>('FNS_TOKEN'));

    const res = await this.http.axiosRef.get<OrganizationResponse>(
      url.toString(),
    );
    const orgResponse = res.data as OrganizationResponse;

    return (orgResponse.Count) ? orgResponse.items[0] : {"ЮЛ": null};
  }
}
