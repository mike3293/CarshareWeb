namespace PublicCarsApi.ApiClients.PublicCarsApi
{
    public record ExternalProvider
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string PinUrl { get; set; }

        public string LogoUrl { get; set; }
    }
}
