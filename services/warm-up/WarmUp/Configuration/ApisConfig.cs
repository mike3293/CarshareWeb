namespace ConfigurationApi.Configuration
{
    public class ApisConfig
    {
        public string IdentityServerUri { get; init; } = default!;

        public string PublicCarsApiUri { get; init; } = default!;

        public string ConfigurationApiUri { get; init; } = default!;

        public string RouteCalculatorApiUri { get; init; } = default!;

        public string UserDataApiUri { get; init; } = default!;
    }
}
