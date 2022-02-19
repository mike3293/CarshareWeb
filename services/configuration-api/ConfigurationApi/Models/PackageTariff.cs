namespace ConfigurationApi.Models
{
    public class PackageTariff
    {
        public string Name { get; set; }

        public int? KopecksCost { get; set; }

        public int? KopecksPerMinute { get; set; }

        public int? KopecksPerMinuteParking { get; set; }

        public int? KopecksPerKilometer { get; set; }

        public int? MinutesIncluded { get; set; }

        public int? ParkingMinutesIncluded { get; set; }

        public int? KilometersIncluded { get; set; }
    }
}
