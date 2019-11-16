using System.Threading.Tasks;
using DirmodAPI.Core.DTOs;
using DirmodAPI.Core.Models;

namespace DirmodAPI.Core.Services
{
    public interface ICambioTodayService
    {
        Task<QuotationResponseDTO> GetQuotation(string currency);
    }
}