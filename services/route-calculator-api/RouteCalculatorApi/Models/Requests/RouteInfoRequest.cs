namespace RouteCalculatorApi.Models.Requests
{
    public record RouteInfoRequest
    {
        public CarSummary Car { get; init; }

        public int Meters { get; init; }

        public int MinutesDriving { get; init; }

        public int MinutesParking { get; init; }
    }
}
