using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using FraudDetectionWeb.Api.Dtos;
using FraudDetectionWeb.Api.Repository;
using FraudDetectionWeb.Api.Mappers;
using FraudDetectionWeb.Api.Model;
using Microsoft.AspNetCore.Mvc;

namespace FraudDetectionWeb.Api.Controllers;

[ApiController]
[Route("api/FraudDetection")]
public class FraudDetectionController : ControllerBase
{
    private readonly IFraudDetectionRepo _repo;
    private readonly IServiceScopeFactory _scopeFactory;

    public FraudDetectionController(
        IFraudDetectionRepo repo, 
        IServiceScopeFactory scopeFactory)
    {
        _repo = repo;
        _scopeFactory = scopeFactory;
    }
    
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        CancellationToken cancellationToken = default)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize is < 1 or > 5001) pageSize = 10;

        var result = await _repo.GetAllAsync(pageNumber, pageSize, cancellationToken);
    
        return Ok(result);
    }

    [HttpGet("GetById/{id:int}")]
    public async Task<IActionResult> GetById(
        int id, 
        CancellationToken cancellationToken)
    {
        var data = await _repo.GetByIdAsync(id, cancellationToken);
        
        if(data == null) return NotFound();
        
        return Ok(data);
    }

    [HttpGet("GetByUserId/{userId:int}")]
    public async Task<IActionResult> GetByUserId(
        int userId, 
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        CancellationToken cancellationToken = default)
    {
        if (pageNumber < 1) pageNumber = 1;
        if (pageSize is < 1 or > 501) pageSize = 10;
        
        var data = await _repo.GetAllByUserIdAsync(pageNumber, pageSize,userId, cancellationToken);
        
        if(data == null) return NotFound();
        
        return Ok(data);
    }
    
    [HttpPost("Create")]
    public async Task<IActionResult> Create([FromBody] UserFraudDetectionDto fraudDetection, CancellationToken cancellationToken)
    {
        var create = await _repo.AddAsync(fraudDetection.Map(), cancellationToken);
        
        return Ok(create);
    }
    
    [HttpPost("ImportCsv")]
    public async Task<IActionResult> ImportCsv(IFormFile? file, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        try
        {
            await using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ",",
                MissingFieldFound = null,
                HeaderValidated = null,
                IgnoreReferences = true,
                BadDataFound = context =>
                {
                    
                }
            });

            csv.Context.RegisterClassMap<FraudDetectionCsvMap>();

            var records = new List<UserFraudDetection>(capacity: 10_000);

            await foreach (var record in csv.GetRecordsAsync<UserFraudDetection>(cancellationToken))
            {
                record.CreatedDate = DateTime.SpecifyKind(record.CreatedDate, DateTimeKind.Utc);
                records.Add(record);
            }

            if (records.Count == 0)
                return BadRequest("No valid records found in the CSV file.");
            
            var firstBatch = records.Take(500).ToList();
            await _repo.AddRangeAsync(firstBatch, cancellationToken);
            
            var remainingRecords = records.Skip(500).ToList();
            _ = Task.Run(async () =>
            {
                using var scope = _scopeFactory.CreateScope();
                var scopedRepo = scope.ServiceProvider.GetRequiredService<IFraudDetectionRepo>();
                
                await scopedRepo.AddRangeAsync(remainingRecords, CancellationToken.None);

            }, cancellationToken);

            return Ok($"Imported first 5000 of {records.Count} records. The rest will be processed in background.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                ex.Message,
                Details = ex.InnerException?.Message
            });
        }
    }

    [HttpPut("Update/{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UserFraudDetectionUpdateDto updateDto, 
        CancellationToken cancellationToken)
    {
        var model = await _repo.UpdateAsync(id, updateDto, cancellationToken);
        
        if (model == null) return NotFound();
        
        return Ok(model);
    }

    [HttpDelete("Delete/{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _repo.DeleteAsync(id, cancellationToken);
        
        return Ok();
    }

    [HttpDelete("DeleteAll")]
    public async Task<IActionResult> DeleteAll(CancellationToken cancellationToken)
    {
        await _repo.DeleteAllAsync(cancellationToken);
        
        return Ok();
    }
}