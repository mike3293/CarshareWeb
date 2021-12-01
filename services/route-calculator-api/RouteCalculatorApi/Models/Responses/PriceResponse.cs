using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RouteCalculatorApi.Models.Responses
{
    public class PriceResponse
    {
        public int Price { get; set; }

        public TariffType TariffType { get; set; }


        public PriceResponse(int price, TariffType tariffType)
        {
            Price = price;
            TariffType = tariffType;
        }
    }
}
