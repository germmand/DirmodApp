using System.Net.Http;
using System.Threading.Tasks;

namespace DirmodAPI.Core.Wrappers
{
    public class HttpClientWrapper : IHttpClientWrapper
    {
        public async Task<HttpResponseMessage> SendAsync(HttpClient client, HttpRequestMessage requestMessage)
        {
            var response = await client.SendAsync(requestMessage);
            return response;
        }
    }
}