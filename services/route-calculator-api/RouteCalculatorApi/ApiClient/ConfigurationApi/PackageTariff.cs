namespace RouteCalculatorApi.ApiClient.ConfigurationApi
{
    public class PackageTariff
    {
        public string Name { get; set; }

        public int KopecksCost { get; set; } = default!;

        public int KopecksPerMinute { get; set; } = default!;

        public int KopecksPerMinuteParking { get; set; } = default!;

        public int KopecksPerKilometer { get; set; } = default!;

        public int MinutesIncluded { get; set; } = default!;

        public int ParkingMinutesIncluded { get; set; } = default!;

        public int KilometersIncluded { get; set; } = default!;
    }
}
