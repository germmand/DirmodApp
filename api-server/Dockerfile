# Stage 1: Building Environment.
FROM mcr.microsoft.com/dotnet/core/sdk:3.0 AS api-build-env
WORKDIR /app
COPY DirmodAPI.sln ./
COPY DirmodAPI.Core/DirmodAPI.Core.csproj DirmodAPI.Core/DirmodAPI.Core.csproj
COPY DirmodAPI.Web/DirmodAPI.Web.csproj DirmodAPI.Web/DirmodAPI.Web.csproj
COPY DirmodAPI.Tests/DirmodAPI.Tests.csproj DirmodAPI.Tests/DirmodAPI.Tests.csproj
RUN dotnet restore
COPY . ./
RUN dotnet build --no-restore -c Release &&\
    dotnet publish DirmodAPI.Web/DirmodAPI.Web.csproj --no-build -c Release -o out

# Stage 2: Production Environment.
FROM mcr.microsoft.com/dotnet/core/aspnet:3.0
WORKDIR /app
COPY --from=api-build-env /app/out ./
ENV ASPNETCORE_URLS http://+:5050
EXPOSE 5050
CMD ["dotnet", "DirmodAPI.Web.dll"]
