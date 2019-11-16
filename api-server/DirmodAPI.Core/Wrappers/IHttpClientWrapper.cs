using System.Net.Http;
using System.Threading.Tasks;

namespace DirmodAPI.Core.Wrappers
{
    public interface IHttpClientWrapper
    {
        Task<HttpResponseMessage> SendAsync(HttpClient client, HttpRequestMessage requestMessage);
    }
}