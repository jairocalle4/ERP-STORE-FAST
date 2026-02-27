FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["ErpStore.Api/ErpStore.Api.csproj", "ErpStore.Api/"]
COPY ["ErpStore.Application/ErpStore.Application.csproj", "ErpStore.Application/"]
COPY ["ErpStore.Domain/ErpStore.Domain.csproj", "ErpStore.Domain/"]
COPY ["ErpStore.Infrastructure/ErpStore.Infrastructure.csproj", "ErpStore.Infrastructure/"]
RUN dotnet restore "ErpStore.Api/ErpStore.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/app/ErpStore.Api"
RUN dotnet build "ErpStore.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ErpStore.Api.csproj" -c Release -o /app/publish

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port 8080 (Render's default for web services)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "ErpStore.Api.dll"]
