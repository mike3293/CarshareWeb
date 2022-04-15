interface CarSummary {
  model: string;
  providerId: string;
}

export interface IRouteInfoRequest {
  car: CarSummary;
  meters: number;
  minutesDriving: number;
  minutesParking: number;
}
