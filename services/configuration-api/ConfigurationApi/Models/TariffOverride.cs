using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace ConfigurationApi.Models;

public class TariffOverride
{
    [BsonId]
    public string UserId { get; set; }

    public IList<CarPriceWithProviderId> CarPrices { get; set; }

    public TariffOverride()
    {
        CarPrices = new List<CarPriceWithProviderId>();
    }

    public TariffOverride(string userId)
    {
        UserId = userId;
        CarPrices = new List<CarPriceWithProviderId>();
    }

    public TariffOverride(string userId, IList<CarPriceWithProviderId> carPrices)
    {
        UserId = userId;
        CarPrices = carPrices;
    }
}
