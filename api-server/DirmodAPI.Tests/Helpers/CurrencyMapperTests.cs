using System;
using DirmodAPI.Web.Helpers;
using Xunit;

namespace DirmodAPI.Tests.Helpers
{
    public class CurrencyMapperTests
    {
        public class MapMethod
        {
            [Fact]
            public void ReturnsValidCurrenciesProperly()
            {
                var tests = new[]
                {
                    new { currency = "dolar", expected = "USD" },
                    new { currency = "euro", expected = "EUR" },
                    new { currency = "real", expected = "BRL"},
                };
                foreach (var test in tests)
                {
                    var actual = CurrencyMapper.Map(test.currency);
                    Assert.Equal(test.expected, actual);
                }
            }

            [Fact]
            public void ReturnsArgumentExceptionOnInvalidCurrency()
            {
                string currency = "dummy_currency";
                string expectedErrorMessage = String.Format(CurrencyMapper.INVALID_CURRENCY_ERROR, currency);
                Exception ex = Assert.Throws<ArgumentException>(() => CurrencyMapper.Map(currency));
                Assert.Equal(expectedErrorMessage, ex.Message);
            }
        }
    }
}