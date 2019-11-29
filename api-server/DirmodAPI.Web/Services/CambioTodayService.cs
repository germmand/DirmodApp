using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using DirmodAPI.Core.DTOs;
using DirmodAPI.Core.Exceptions;
using DirmodAPI.Core.Models;
using DirmodAPI.Core.Services;
using DirmodAPI.Core.Settings;
using DirmodAPI.Core.Wrappers;
using DirmodAPI.Web.Helpers;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace DirmodAPI.Web.Services
{
    public class CambioTodayService : ICambioTodayService
    {
        // This is made public for unit-testing purposes.
        public static readonly string CAMBIOTODAYAPI_ERROR_MESSAGE = "Something went wrong contacting the CambioToday API";
        
        private readonly IHttpClientFactory _clientFactory;
        private readonly IHttpClientWrapper _clientWrapper;
        private readonly IMapper _mapper;
        private readonly CambioTodaySettings _cambioTodaySettings;
        
        public CambioTodayService(IHttpClientFactory clientFactory,
                                  IHttpClientWrapper clientWrapper,
                                  IOptions<CambioTodaySettings> cts,
                                  IMapper mapper)
        {
            _clientFactory = clientFactory;
            _clientWrapper = clientWrapper;
            _cambioTodaySettings = cts.Value;
            _mapper = mapper;
        }
        
        public async Task<QuotationResponseDTO> GetQuotation(string currency)
        { 
            var client = _clientFactory.CreateClient("cambio.today");
            var url = 
                $"quotes/{CurrencyMapper.Map(currency)}/ARS/json?quantity=1&key={_cambioTodaySettings.Key}";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await _clientWrapper.SendAsync(client, request);
            if (!response.IsSuccessStatusCode)
            {
                throw new CambioTodayAPIException(CAMBIOTODAYAPI_ERROR_MESSAGE);
            }
            var contentResponse = await response.Content.ReadAsStringAsync();
            var cambioTodayResponse = JsonConvert.DeserializeObject<QuotesModelCTResponse>(contentResponse);
            var quotationResponse = _mapper.Map<QuotationResponseDTO>(cambioTodayResponse.Result);
            return quotationResponse;
        }
    }
}