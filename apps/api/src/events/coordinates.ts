import { PrismaService } from '@app/db';

export class Coordinates {
  constructor(
    public latitude: number,
    public longitude: number,
  ) {}

  distanceTo(
    targetCoordinates: Coordinates,
    unitOfLength: UnitOfLength = UnitOfLength.Kilometers,
  ): number {
    return this.calculateDistance(targetCoordinates, unitOfLength) * 1000;
  }

  private calculateDistance(
    targetCoordinates: Coordinates,
    unitOfLength: UnitOfLength,
  ): number {
    const baseRad = (Math.PI * this.latitude) / 180;
    const targetRad = (Math.PI * targetCoordinates.latitude) / 180;
    const theta = this.longitude - targetCoordinates.longitude;
    const thetaRad = (Math.PI * theta) / 180;

    let dist =
      Math.sin(baseRad) * Math.sin(targetRad) +
      Math.cos(baseRad) * Math.cos(targetRad) * Math.cos(thetaRad);

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;

    return unitOfLength.convertFromMiles(dist);
  }
}

// UnitOfLength.ts
export class UnitOfLength {
  static Kilometers = new UnitOfLength(1.609344);
  static NauticalMiles = new UnitOfLength(0.8684);
  static Miles = new UnitOfLength(1);

  constructor(private fromMilesFactor: number) {}

  convertFromMiles(input: number): number {
    return input * this.fromMilesFactor;
  }
}

export class DistanceService {
  constructor(private prisma: PrismaService) {}

  getDistanceToMark(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
  ) {
    const distance = this.getDistanceBetweenCoordinates(
      latitude1,
      longitude1,
      latitude2,
      longitude2,
    );
    return distance;
  }

  private getDistanceBetweenCoordinates(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const coord1 = new Coordinates(lat1, lon1);
    const coord2 = new Coordinates(lat2, lon2);
    return coord1.distanceTo(coord2);
  }
}
