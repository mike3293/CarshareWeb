using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using PublicCarsApi.ApiClients.PublicCarsApi;
using PublicCarsApi.Configuration;
using PublicCarsApi.Models.Requests;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace PublicCarsApi.UnitTests.PublicCarsController
{
    public class GetProvidersCarTypes
    {
        [Fact]
        public async void GetTypes()
        {
            // Arrange
            var car = new ExternalCar() { Id = "123", Lat = 53, Lon = 50, Fuel = 43, Reg = "1234", Brand = "brand", Model = "model", ImageUrl = "/img", Provider = new ExternalProvider() { Id = "provider", Name = "name", PinUrl = "/", LogoUrl = "/" } };

            var logger = new Mock<ILogger<Controllers.PublicCarsController>>();
            var options = Options.Create(new ExternalCarsConfig() { Enabled = false, ExternalPublicCarsApiUri = "/" });
            var client = new Mock<ExternalPublicCarsApiClient>(options);
            client.Setup(x => x.GetExternalCarsAsync()).ReturnsAsync(new List<ExternalCar>() { car });
            
            var controller = new Controllers.PublicCarsController(logger.Object, client.Object);

            // Act
            var result = await controller.GetProvidersCarTypes();

            // Assert
            var resultProvider = result.First();
            Assert.True(resultProvider.Id == "provider");
            Assert.True(resultProvider.Cars.Count() == 1);
            var firstCar = resultProvider.Cars.First();
            Assert.True(firstCar.Brand == "brand");
            Assert.True(firstCar.Model == "model");
        }
    }
}
