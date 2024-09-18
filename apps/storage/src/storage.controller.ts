import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { FileModel } from './models/file.model';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly aws: StorageService) {}

  @ApiOkResponse({
    type: FileModel,
  })
  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post(':bucket')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('bucket') bucket: string,
  ) {
    return this.aws.upload({ file, bucket });
  }

  @ApiOkResponse({
    type: FileModel,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    type: FileModel,
  })
  @Get(':bucket/:id')
  async getLink(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('bucket') bucket: string,
  ) {
    const candidate = await this.aws.file({ uuid: id, bucket });

    return candidate;
  }
}
