import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsDataPeriodModel {
  @ApiProperty()
  attend: number;

  @ApiProperty()
  unattend: number;

  @ApiProperty()
  favorite: number;

  @ApiProperty()
  unfavorite: number;

  @ApiProperty()
  comments: number;
}

export class AnalyticsDataTotalGenderModel {
  @ApiProperty()
  total: number;

  @ApiProperty()
  female: number;

  @ApiProperty()
  male: number;

  @ApiProperty()
  unknown: number;
}

export class AnalyticsDataTotalAgeModel {
  @ApiProperty()
  adult: number;

  @ApiProperty()
  sixteen: number;

  @ApiProperty()
  twelve: number;

  @ApiProperty()
  six: number;
}

export class AnalyticsDataTotalModel {
  @ApiProperty()
  gender: AnalyticsDataTotalGenderModel;

  @ApiProperty()
  age: AnalyticsDataTotalAgeModel;
}

export class AnalyticsDataModel {
  @ApiProperty()
  total: AnalyticsDataTotalModel;

  @ApiProperty()
  period: AnalyticsDataPeriodModel;
}

export class PeriodModel {
  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;
}

export class AnalyticsModel {
  @ApiProperty()
  period: PeriodModel;

  @ApiProperty()
  data: AnalyticsDataModel;
}

/*
return {
      period: {
        start: period.start,
        end: period.end,
      },
      data: {
        total,
        period: {
          attend,
          unattend,
          favorite,
          unfavorite,
          comment,
        },
      },
    };
*/
