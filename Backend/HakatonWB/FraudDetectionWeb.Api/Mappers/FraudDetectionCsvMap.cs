using CsvHelper.Configuration;
using FraudDetectionWeb.Api.Model;

namespace FraudDetectionWeb.Api.Mappers;

public sealed class FraudDetectionCsvMap : ClassMap<UserFraudDetection>
{
    public FraudDetectionCsvMap()
    {
        Map(m => m.Id).Ignore();
        Map(m => m.UserId).Name("user_id");
        Map(m => m.NmId).Name("nm_id");
        Map(m => m.CreatedDate).Name("CreatedDate")
            .TypeConverterOption.Format("yyyy-MM-dd HH:mm:sszzz");
        Map(m => m.Service).Name("service");
        Map(m => m.TotalOrdered).Name("total_ordered");
        Map(m => m.PaymentType).Name("PaymentType");
        Map(m => m.IsPaid).Name("IsPaid");
        Map(m => m.CountItems).Name("count_items");
        Map(m => m.UniqueItems).Name("unique_items");
        Map(m => m.AvgUniquePurchase).Name("avg_unique_purchase");
        Map(m => m.IsCourier).Name("is_courier");
        Map(m => m.NmAge).Name("NmAge");
        Map(m => m.Distance).Name("Distance");
        Map(m => m.DaysAfterRegistration).Name("DaysAfterRegistration");
        Map(m => m.NumberOfOrders).Name("number_of_orders");
        Map(m => m.NumberOfOrderedItems).Name("number_of_ordered_items");
        Map(m => m.MeanNumberOfOrderedItems).Name("mean_number_of_ordered_items");
        Map(m => m.MinNumberOfOrderedItems).Name("min_number_of_ordered_items");
        Map(m => m.MaxNumberOfOrderedItems).Name("max_number_of_ordered_items");
        Map(m => m.MeanPercentOfOrderedItems).Name("mean_percent_of_ordered_items");
        Map(m => m.Target).Name("target");
    }
}