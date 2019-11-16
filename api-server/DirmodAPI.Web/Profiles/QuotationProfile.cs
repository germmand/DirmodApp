using AutoMapper;
using DirmodAPI.Core.DTOs;
using DirmodAPI.Core.Models;

namespace DirmodAPI.Web.Profiles
{
    public class QuotationProfile : Profile
    {
        public QuotationProfile()
        {
            CreateMap<QuotesModel, QuotationResponseDTO>()
                .ForMember(
                    dest => dest.Price, 
                    opt => opt.MapFrom(src => src.Value)
                )
                .ForMember(
                    dest => dest.Currency,
                    opt => opt.MapFrom(src => src.Source)
                );
        } 
    }
}