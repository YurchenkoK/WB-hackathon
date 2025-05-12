using FraudDetectionWeb.Api.Dtos;
using FraudDetectionWeb.Api.Model;
using FraudDetectionWeb.Api.Query;

namespace FraudDetectionWeb.Api.Repository;

public interface IFraudDetectionRepo
{
    Task<PaginatedResult<UserFraudDetection>?> GetAllAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<PaginatedResult<UserFraudDetection>?> GetAllByUserIdAsync(int pageNumber, int pageSize, int userId, CancellationToken cancellationToken);
    Task<UserFraudDetection?> GetByIdAsync(int id, CancellationToken cancellationToken);
    
    Task<UserFraudDetection> AddAsync(UserFraudDetection fraudDetection, CancellationToken cancellationToken);
    Task AddRangeAsync(IEnumerable<UserFraudDetection> entities, CancellationToken cancellationToken);
    
    Task<UserFraudDetection?> UpdateAsync(int id, UserFraudDetectionUpdateDto dto, CancellationToken cancellationToken);
    
    
    Task DeleteAsync(int id, CancellationToken cancellationToken);
    Task DeleteAllAsync(CancellationToken cancellationToken);
}