interface CarSummary {
  model: string;
  providerId: string;
}

export interface Section {
  meters: number;
  seconds: number;
  parkingMinutes: number;
}

export interface IRouteInfoRequest {
  car: CarSummary;
  routeSections: Section[];
}
