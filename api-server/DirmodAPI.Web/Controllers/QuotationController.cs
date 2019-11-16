using System;
using System.Net;
using System.Threading.Tasks;
using DirmodAPI.Core.DTOs;
using DirmodAPI.Core.Exceptions;
using DirmodAPI.Core.Models;
using DirmodAPI.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DirmodAPI.Web.Controllers
{
    [ApiController]
    [Route("api/v1/cotizacion")]
    public class QuotationController : ControllerBase
    {
        private readonly ICambioTodayService _cambioTodayService;
        
        public QuotationController(ICambioTodayService cambioTodayService)
        {
            _cambioTodayService = cambioTodayService;
        }

        [HttpGet("{currency}")]
        public async Task<IActionResult> Get(string currency)
        {
            try
            {
                var response = await _cambioTodayService.GetQuotation(currency);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                var error = new HttpErrorModel()
                {
                    Message = ex.Message,
                };
                return BadRequest(error);
            }
            catch (CambioTodayAPIException ex)
            {
                var error = new HttpErrorModel()
                {
                    Message = ex.Message,
                };
                return StatusCode(StatusCodes.Status502BadGateway, error);
            }
        }
    }
}