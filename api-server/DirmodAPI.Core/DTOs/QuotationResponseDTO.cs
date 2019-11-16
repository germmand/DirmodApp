namespace DirmodAPI.Core.DTOs
{
    /// <summary>
    /// This is the model used to return to the Clients when requesting: /cotizacion/<moneda>.
    /// </summary>
    public class QuotationResponseDTO
    {
        /// <summary>
        /// The currency we're converting into (i.e. dolar, euro, real).
        /// </summary>
        public string Currency { get; set; }
        /// <summary>
        /// The equivalent of one unit converted into that currency.
        /// </summary>
        public float Price { get; set; }
    }
}