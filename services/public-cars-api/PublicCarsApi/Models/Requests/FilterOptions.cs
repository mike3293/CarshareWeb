namespace PublicCarsApi.Models.Requests
{
    public class FilterOptions
    {
        public string[] ProviderIds { get; set; }

        public int? FuelLevel { get; set; }
    }
}
