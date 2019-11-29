using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using DirmodAPI.Core.DTOs;
using DirmodAPI.Core.Exceptions;
using DirmodAPI.Core.Models;
using DirmodAPI.Core.Services;
using DirmodAPI.Core.Settings;
using DirmodAPI.Core.Wrappers;
using DirmodAPI.Web.Services;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace DirmodAPI.Tests.Services
{
    public class CambioTodayServiceTests
    {
        public class GetQuotationMethod
        {
            private ICambioTodayService _cambioTodayService;
            private Mock<IMapper> _mapperMock;
            private Mock<IHttpClientWrapper> _clientWrapperMock;
            private Mock<IHttpClientFactory> _clientFactoryMock;
            private Mock<IOptions<CambioTodaySettings>> _optionsSettingsMock;

            private CambioTodaySettings _settings;
           
            public GetQuotationMethod()
            {
                _settings = new CambioTodaySettings()
                {
                    Key = "dummy_api_key",
                };
                
                _mapperMock          = new Mock<IMapper>();
                _clientFactoryMock   = new Mock<IHttpClientFactory>();
                _clientWrapperMock   = new Mock<IHttpClientWrapper>();
                _optionsSettingsMock = new Mock<IOptions<CambioTodaySettings>>();
                
                _optionsSettingsMock
                    .Setup(x => x.Value)
                    .Returns(_settings);
                
                _cambioTodayService  = new CambioTodayService(_clientFactoryMock.Object,
                                                              _clientWrapperMock.Object,
                                                              _optionsSettingsMock.Object,
                                                              _mapperMock.Object);
            }

            [Fact]
            public async Task ThrowsCambioTodayAPIExceptionOnNonSuccesfulStatusCode()
            {
                string currency = "dolar";
                string expectedErrorMessage = CambioTodayService.CAMBIOTODAYAPI_ERROR_MESSAGE;
                var response = new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.BadRequest,
                };
                _clientWrapperMock
                    .Setup(x => x.SendAsync(It.IsAny<HttpClient>(), It.IsAny<HttpRequestMessage>()))
                    .ReturnsAsync(response);
                Exception ex =
                    await Assert.ThrowsAsync<CambioTodayAPIException>(() => _cambioTodayService.GetQuotation(currency));
                Assert.Equal(expectedErrorMessage, ex.Message);
            }

            [Fact]
            public async Task CallsTheCorrectQuotesEndpoint()
            {
                string currency = "dolar";
                var client = new HttpClient();
                var expectedUrl = $"quotes/USD/ARS/json?quantity=1&key={_settings.Key}";
                var expectedRequest = new HttpRequestMessage(HttpMethod.Get, expectedUrl);
                var responseMock = new HttpResponseMessage()
                {
                    Content = new StringContent(@"
                        {
                            dummy: 'content' 
                        }
                    "),
                };
                HttpRequestMessage requestCalled = new HttpRequestMessage();
                _clientFactoryMock
                    .Setup(x => x.CreateClient(It.IsAny<string>()))
                    .Returns(client);
                _clientWrapperMock
                    .Setup(x => x.SendAsync(It.IsAny<HttpClient>(), It.IsAny<HttpRequestMessage>()))
                    .Callback<HttpClient, HttpRequestMessage>((c, r) => requestCalled = r)
                    .ReturnsAsync(responseMock);
                await _cambioTodayService.GetQuotation(currency);
                _clientWrapperMock.Verify(x => x.SendAsync(It.IsAny<HttpClient>(), It.IsAny<HttpRequestMessage>()), Times.Once);
                requestCalled.Should().BeEquivalentTo(expectedRequest);
            }

            [Fact]
            public async Task ReturnsExpectedQuotation()
            {
                string currency = "dolar";
                var quotationResponseExpected = new QuotationResponseDTO()
                {
                    Currency = "USD",
                    Price = (float)45.55,
                };
                var responseMock = new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(@" {
                        status: 'OK',
                        result: {
                            value: 45.55,
                            source: 'USD',
                        }
                    }"),
                };
                _clientWrapperMock
                    .Setup(x => x.SendAsync(It.IsAny<HttpClient>(), It.IsAny<HttpRequestMessage>()))
                    .ReturnsAsync(responseMock);
                _mapperMock
                    .Setup(x => x.Map<QuotationResponseDTO>(It.IsAny<QuotesModel>()))
                    .Returns(quotationResponseExpected);
                QuotationResponseDTO actualQuotationResponse = await _cambioTodayService.GetQuotation(currency);
                actualQuotationResponse.Should().BeEquivalentTo(quotationResponseExpected);
            }
        }
    }
}