import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Scope,
} from '@nestjs/common';
import { FileModel } from './models/file.model';
import * as AWS from 'aws-sdk';
import { PrismaService } from '@app/db';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT })
export class StorageService {
  private readonly endpoint: string;
  private readonly s3: AWS.S3;
  private readonly logger = new Logger(StorageService.name);

  private static readonly AWS_REGION = 'ru';

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @Inject('FILE_ID') private readonly fileId: () => string,
  ) {
    this.endpoint = this.config.get<string>('S3_ENDPOINT');
    this.s3 = new AWS.S3({
      apiVersion: 'latest',
      endpoint: this.endpoint,
      region: StorageService.AWS_REGION,
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.config.get<string>('S3_SECRET_KEY'),
      },
      hostPrefixEnabled: false,
      s3ForcePathStyle: true,
    });
  }

  async upload(params: {
    file: Express.Multer.File;
    bucket: string;
  }): Promise<FileModel> {
    const { file, bucket } = params;

    if (!bucket || bucket.length == 0) {
      throw new HttpException('Invalid bucket', HttpStatus.BAD_REQUEST);
    }

    if (!file || file.size == 0) {
      throw new HttpException('Invalid file', HttpStatus.BAD_REQUEST);
    }

    const id = this.fileId();
    let url: string;

    try {
      const s3Upload = await this.s3
        .upload({
          Bucket: bucket,
          Key: id,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        })
        .promise();

      url = s3Upload.Location;
    } catch (e) {
      console.log(e);

      return {
        title: file.originalname,
        type: file.mimetype,
        uploaded: false,
        url: null,
        id: id,
        region: StorageService.AWS_REGION,
      };
    }

    const db = await this.prisma.file.create({
      data: {
        id,
        type: file.mimetype,
        original_name: file.originalname,
        url, //`${this.endpoint}/${this.bucket}/${id}`,
        bucket: bucket,
        region: StorageService.AWS_REGION,
      },
    });

    return {
      id: db.id,
      title: db.original_name,
      uploaded: true,
      url: db.url,
      type: db.type,
      region: db.region,
    };
  }

  async file(params: { uuid: string; bucket: string }): Promise<FileModel> {
    const { bucket, uuid } = params;

    const candidate = await this.prisma.file.findFirst({
      where: {
        id: uuid,
        bucket: bucket,
      },
    });

    if (!candidate) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: candidate.id,
      title: candidate.original_name,
      uploaded: true,
      url: candidate.url,
      type: candidate.type,
      region: candidate.region,
    };
  }
}
