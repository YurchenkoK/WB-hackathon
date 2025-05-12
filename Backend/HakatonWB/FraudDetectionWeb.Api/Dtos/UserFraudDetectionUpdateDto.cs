namespace FraudDetectionWeb.Api.Dtos;

public class UserFraudDetectionUpdateDto
{
    public int UserId { get; set; }
    public DateTime CreatedDate { get; set; }
    public int NmId { get; set; }
    public int TotalOrdered { get; set; }
    public string PaymentType { get; set; }
    public bool IsPaid { get; set; }
    public int CountItems { get; set; }
    public int UniqueItems { get; set; }
    public double AvgUniquePurchase { get; set; }
    public bool IsCourier { get; set; }
    public int NmAge { get; set; }
    public double Distance { get; set; }
    public int DaysAfterRegistration { get; set; }
    public int NumberOfOrders { get; set; }
    public int NumberOfOrderedItems { get; set; }
    public double MeanNumberOfOrderedItems { get; set; }
    public int MinNumberOfOrderedItems { get; set; }
    public int MaxNumberOfOrderedItems { get; set; }
    public double MeanPercentOfOrderedItems { get; set; }
    public string Service { get; set; }  
}