namespace FraudDetectionWeb.Api.Query;

public class PaginatedResult<T>
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public IEnumerable<T> Data { get; set; }
}