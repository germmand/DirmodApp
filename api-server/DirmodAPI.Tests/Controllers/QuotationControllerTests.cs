using System;
using System.Threading.Tasks;
using DirmodAPI.Core.DTOs;
using DirmodAPI.Core.Exceptions;
using DirmodAPI.Core.Models;
using DirmodAPI.Core.Services;
using DirmodAPI.Web.Controllers;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace DirmodAPI.Tests.Controllers
{
    public class QuotationControllerTests
    {
        public class GetMethod
        {
            private readonly QuotationController quotationController;
            private readonly Mock<ICambioTodayService> _cambioTodayServiceMock;
            
            public GetMethod()
            {
                _cambioTodayServiceMock = new Mock<ICambioTodayService>(); 
                quotationController     = new QuotationController(_cambioTodayServiceMock.Object);
            }

            [Fact]
            public async Task ReturnsExpectedQuotationProperly()
            {
                var expectedQuotation = new QuotationResponseDTO()
                {
                    Currency = "USD",
                    Price = (float)50.55,
                };
                string currency = "dolar";
                _cambioTodayServiceMock
                    .Setup(x => x.GetQuotation(It.IsAny<string>()))
                    .ReturnsAsync(expectedQuotation);
                var result = await quotationController.Get(currency);
                var okResult = Assert.IsType<OkObjectResult>(result);
                var returnedQuotation = Assert.IsType<QuotationResponseDTO>(okResult.Value);
                returnedQuotation.Should().BeEquivalentTo(expectedQuotation); 
            }

            [Fact]
            public async Task ReturnsBadRequestOnArgumentException()
            {
                string currency = "dolar";
                var expectedError = new HttpErrorModel()
                {
                    Message = "dummy error message [bad request]",
                };
                _cambioTodayServiceMock
                    .Setup(x => x.GetQuotation(It.IsAny<string>()))
                    .ThrowsAsync(new ArgumentException(expectedError.Message));
                var result = await quotationController.Get(currency);
                var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
                var returnedError = Assert.IsType<HttpErrorModel>(badRequestResult.Value);
                returnedError.Should().BeEquivalentTo(expectedError);
            }

            [Fact]
            public async Task ReturnsBadGatewayOnCambioTodayAPIException()
            {
                string currency = "dolar";
                var expectedError = new HttpErrorModel()
                {
                    Message = "dummy error message [bad gateway]",
                };
                _cambioTodayServiceMock
                    .Setup(x => x.GetQuotation(It.IsAny<string>()))
                    .ThrowsAsync(new CambioTodayAPIException(expectedError.Message));
                var result = await quotationController.Get(currency);
                var objectResult = Assert.IsType<ObjectResult>(result);
                Assert.Equal(StatusCodes.Status502BadGateway, objectResult.StatusCode);
                var returnedError = Assert.IsType<HttpErrorModel>(objectResult.Value);
                returnedError.Should().BeEquivalentTo(expectedError);
            }
        }
    }
}