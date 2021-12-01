interface CarSummary {
  model: string;
  providerId: string;
}

export interface IRouteInfoRequest {
  car: CarSummary;
  distance: number;
  travelTime: number;
  parkingTime: number;
}
