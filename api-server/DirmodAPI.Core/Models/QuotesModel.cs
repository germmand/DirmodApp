using System;

namespace DirmodAPI.Core.Models
{
    /// <summary>
    /// This is the model used to map only the response result from the Cambio.Today API.
    /// </summary>
    public class QuotesModel
    {
        /// <summary>
        /// The last time the quote was updated.
        /// </summary>
        public DateTime Updated { get; set; } 
        /// <summary>
        /// The currency we're trying to convert from.
        /// </summary>
        public string Source { get; set; }
        /// <summary>
        /// The currency we're trying to convert into.
        /// </summary>
        public string Target { get; set; }
        /// <summary>
        /// The independent value of one unit.
        /// </summary>
        public float Value { get; set; }
        /// <summary>
        /// The amount of units we're trying to convert.
        /// </summary>
        public float Quantity { get; set; }
        /// <summary>
        /// The result of multiplying Quantity x Value.
        /// </summary>
        public float Amount { get; set; }
    }

    /// <summary>
    /// This is the exact model returned by the CambioToday API.
    /// </summary>
    public class QuotesModelCTResponse
    {
        public QuotesModel Result { get; set; }
        public string Status { get; set; }
    }
}