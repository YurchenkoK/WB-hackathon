namespace FraudDetectionWeb.Api.Dtos;

public class UserFraudDetectionDto
{
    public int UserId { get; set; }
    public int NmId { get; set; }                         // идентификатор товара
    public int TotalOrdered { get; set; }                 // общее количество заказанных товаров
    public string PaymentType { get; set; }              // тип оплаты
    public bool IsPaid { get; set; }                      // флаг оплаты
    public int CountItems { get; set; }                   // количество товаров за последнее время
    public int UniqueItems { get; set; }                  // количество уникальных товаров за последнее время
    public double AvgUniquePurchase { get; set; }         // среднее количество уникальных покупок
    public bool IsCourier { get; set; }                   // флаг доставки курьером
    public int NmAge { get; set; }                        // возраст товара
    public double Distance { get; set; }                  // расстояние
    public int DaysAfterRegistration { get; set; }        // дни после регистрации
    public int NumberOfOrders { get; set; }               // количество заказов
    public int NumberOfOrderedItems { get; set; }         // количество заказанных товаров
    public double MeanNumberOfOrderedItems { get; set; }  // среднее количество заказанных товаров
    public int MinNumberOfOrderedItems { get; set; }      // минимальное количество заказанных товаров
    public int MaxNumberOfOrderedItems { get; set; }      // максимальное количество заказанных товаров
    public double MeanPercentOfOrderedItems { get; set; } // средний процент заказанных товаров
    public string Service { get; set; }  
}