using System;

namespace DirmodAPI.Core.Exceptions
{
    public class CambioTodayAPIException : Exception
    {
        public CambioTodayAPIException()
        {
        }

        public CambioTodayAPIException(string message)
            : base(message)
        {
        }

        public CambioTodayAPIException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}