using FraudDetectionWeb.Api.DB;
using FraudDetectionWeb.Api.Extensions;
using FraudDetectionWeb.Api.Repository;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://host.docker.internal:8000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});



services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

services.AddControllers();

services.AddDbContextExtensions(configuration);

services.AddScoped<IFraudDetectionRepo, FraudDetectionRepo>();
services.AddScoped<HttpClient>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.MapControllers();

app.Run();