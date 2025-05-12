FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["FraudDetectionWeb.Api/FraudDetectionWeb.Api.csproj", "FraudDetectionWeb.Api/"]
RUN dotnet restore "FraudDetectionWeb.Api/FraudDetectionWeb.Api.csproj"
COPY . .
WORKDIR "/src/FraudDetectionWeb.Api"
RUN dotnet build "FraudDetectionWeb.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "FraudDetectionWeb.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT ["dotnet", "FraudDetectionWeb.Api.dll"]
