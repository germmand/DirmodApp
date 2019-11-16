using System;

namespace DirmodAPI.Web.Helpers
{
    public static class CurrencyMapper
    {
        public static string INVALID_CURRENCY_ERROR = "The currency: '{0}' is invalid or not yet supported.";
        
        public static string Map(string currency)
        {
            string currencyLower = currency.ToLower();
            switch (currencyLower)
            {
                case "dolar":
                    return "USD";
                case "euro":
                    return "EUR";
                case "real":
                    return "BRL";
                default:
                    string error = String.Format(INVALID_CURRENCY_ERROR, currency);
                    throw new ArgumentException(error);
            }
        }
    }
}