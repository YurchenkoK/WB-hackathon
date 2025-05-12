using System.Text.Json;
using FraudDetectionWeb.Api.DB;
using FraudDetectionWeb.Api.Dtos;
using FraudDetectionWeb.Api.Model;
using FraudDetectionWeb.Api.Query;
using Microsoft.EntityFrameworkCore;


namespace FraudDetectionWeb.Api.Repository;

public class FraudDetectionRepo : IFraudDetectionRepo
{
    private readonly AppDbContext _context;

    public FraudDetectionRepo(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<UserFraudDetection>?> GetAllAsync(
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var query = _context.UserFraudDetections.AsNoTracking();
        
        var totalCount = await query.CountAsync(cancellationToken);
        
        var data = await query
            .OrderBy(d=>d.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var result = new PaginatedResult<UserFraudDetection>
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            Data = data
        };

        return result;
    }

    
    public async Task<PaginatedResult<UserFraudDetection>?> GetAllByUserIdAsync(int pageNumber, int pageSize, int userId, CancellationToken cancellationToken)
    {
        var query = _context.UserFraudDetections
            .AsNoTracking()
            .Where(fd => fd.UserId == userId);
        
        var totalCount = await query.CountAsync(cancellationToken);
        var data = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .OrderBy(d=>d.Id)
            .ToListAsync(cancellationToken);
        
        return new PaginatedResult<UserFraudDetection>
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            Data = data
        };
    }

    public async Task<UserFraudDetection?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var fraudDetection = await _context.UserFraudDetections
            .AsNoTracking()
            .FirstOrDefaultAsync(fd => fd.Id == id, cancellationToken);
        
        return fraudDetection;
    }
    
    public async Task<UserFraudDetection> AddAsync(UserFraudDetection userFraudDetection, CancellationToken cancellationToken)
    {
        userFraudDetection.CreatedDate = DateTime.UtcNow;
        
        await _context.AddAsync(userFraudDetection, cancellationToken);
        
        await _context.SaveChangesAsync(cancellationToken);
        
        var id = await _context.UserFraudDetections.MaxAsync(fd => fd.Id, cancellationToken);
        
        using var httpClient = new HttpClient();
        var response = await httpClient.GetAsync($"http://host.docker.internal:8000/predict/{id}", cancellationToken);
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
        
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
        
        var newFraud = JsonSerializer.Deserialize<List<FraudPredictionDto>>(responseContent, options);

        userFraudDetection.Target = newFraud![0].Prediction;
        userFraudDetection.Confidence = newFraud![0].Confidence;
        await _context.SaveChangesAsync(cancellationToken);
    
        return userFraudDetection;
    }

    public async Task AddRangeAsync(IEnumerable<UserFraudDetection> entities, CancellationToken cancellationToken = default)
    {
        var entityList = entities.ToList();
        
        foreach (var entity in entityList)
        {
            await _context.AddAsync(entity, cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);
        
        const int pageSize = 500;
        int totalRecords = entityList.Count;
        int totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

        for (int pageNumber = 1; pageNumber <= totalPages; pageNumber++)
        {
            using var httpClient = new HttpClient();
            var response = await httpClient.GetAsync($"http://host.docker.internal:8000/predict/all?pageNumber={pageNumber}&pageSize={pageSize}", cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                var newFraudList = JsonSerializer.Deserialize<List<FraudPredictionDto>>(responseContent, options);

                if (newFraudList != null)
                {
                    foreach (var userFraudDetection in entityList.Skip((pageNumber - 1) * pageSize).Take(pageSize))
                    {
                        var prediction = newFraudList.FirstOrDefault(f => f.Id == userFraudDetection.Id);
                        if (prediction != null)
                        {
                            userFraudDetection.Target = prediction.Prediction;
                            userFraudDetection.Confidence = prediction.Confidence;
                        }
                    }
                }
            }
        }
        
        await _context.SaveChangesAsync(cancellationToken);
    }



    
    public async Task<UserFraudDetection?> UpdateAsync(int id, UserFraudDetectionUpdateDto dto, CancellationToken cancellationToken)
    {
        var entity = await _context.UserFraudDetections
            .FirstOrDefaultAsync(fd => fd.Id == id, cancellationToken);
    
        if (entity == null) 
            return null;
        
        entity.UserId = dto.UserId;
        entity.CreatedDate = dto.CreatedDate;
        entity.NmId = dto.NmId;
        entity.TotalOrdered = dto.TotalOrdered;
        entity.PaymentType = dto.PaymentType;
        entity.IsPaid = dto.IsPaid;
        entity.CountItems = dto.CountItems;
        entity.UniqueItems = dto.UniqueItems;
        entity.AvgUniquePurchase = dto.AvgUniquePurchase;
        entity.IsCourier = dto.IsCourier;
        entity.NmAge = dto.NmAge;
        entity.Distance = dto.Distance;
        entity.DaysAfterRegistration = dto.DaysAfterRegistration;
        entity.NumberOfOrders = dto.NumberOfOrders;
        entity.NumberOfOrderedItems = dto.NumberOfOrderedItems;
        entity.MeanNumberOfOrderedItems = dto.MeanNumberOfOrderedItems;
        entity.MinNumberOfOrderedItems = dto.MinNumberOfOrderedItems;
        entity.MaxNumberOfOrderedItems = dto.MaxNumberOfOrderedItems;
        entity.MeanPercentOfOrderedItems = dto.MeanPercentOfOrderedItems;
        entity.Service = dto.Service;
        
        await _context.SaveChangesAsync(cancellationToken);
    
        return entity;
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var fraudDetection = await _context.UserFraudDetections
            .FirstOrDefaultAsync(fd => fd.Id == id, cancellationToken);

        if (fraudDetection==null)
        {
            throw new KeyNotFoundException();
        }

        _context.UserFraudDetections.Remove(fraudDetection);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAllAsync(CancellationToken cancellationToken = default)
    {
        await _context.UserFraudDetections.ExecuteDeleteAsync(cancellationToken);

        
        await _context.Database.ExecuteSqlRawAsync(
            "ALTER SEQUENCE \"UserFraudDetections_Id_seq\" RESTART WITH 1", 
            cancellationToken);
    }

}