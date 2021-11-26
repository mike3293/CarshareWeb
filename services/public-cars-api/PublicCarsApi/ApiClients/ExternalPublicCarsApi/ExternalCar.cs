namespace PublicCarsApi.ApiClients.PublicCarsApi
{
    public record ExternalCar
    {
        public string Id { get; set; }

        public double? LatPrecise { get; set; }

        public double Lat { get; set; }

        public double? LonPrecise { get; set; }

        public double Lon { get; set; }

        public int Fuel { get; set; }

        public string Reg { get; set; }

        public string Brand { get; set; }

        public string Model { get; set; }

        public string ImageUrl { get; set; }

        public ExternalProvider Provider { get; set; }
    }
}
