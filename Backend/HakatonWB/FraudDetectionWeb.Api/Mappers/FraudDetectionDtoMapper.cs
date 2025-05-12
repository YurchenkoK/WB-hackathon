using FraudDetectionWeb.Api.Dtos;
using FraudDetectionWeb.Api.Model;

namespace FraudDetectionWeb.Api.Mappers;

public static class FraudDetectionDtoMapper
{
    public static UserFraudDetection Map(this UserFraudDetectionDto? hakaton)
    {
        var userFraudDetection = new UserFraudDetection
        {
            UserId = hakaton!.UserId,
            NmId = hakaton.NmId,
            TotalOrdered = hakaton.TotalOrdered,
            PaymentType = hakaton.PaymentType,
            IsPaid = hakaton.IsPaid,
            CountItems = hakaton.CountItems,
            UniqueItems = hakaton.UniqueItems,
            AvgUniquePurchase = hakaton.AvgUniquePurchase,
            IsCourier = hakaton.IsCourier,
            NmAge = hakaton.NmAge,
            Distance = hakaton.Distance,
            DaysAfterRegistration = hakaton.DaysAfterRegistration,
            NumberOfOrders = hakaton.NumberOfOrders,
            NumberOfOrderedItems = hakaton.NumberOfOrderedItems,
            MeanNumberOfOrderedItems = hakaton.MeanNumberOfOrderedItems,
            MinNumberOfOrderedItems = hakaton.MinNumberOfOrderedItems,
            MaxNumberOfOrderedItems = hakaton.MaxNumberOfOrderedItems,
            MeanPercentOfOrderedItems = hakaton.MeanPercentOfOrderedItems,
            Target = 0,
            Service = hakaton.Service,
            Confidence = 0
        };

        return userFraudDetection;
    }
    
    public static UserFraudDetection Map(this UserFraudDetectionUpdateDto? hakaton)
    {
        var userFraudDetection = new UserFraudDetection
        {
            UserId = hakaton!.UserId,
            NmId = hakaton.NmId,
            TotalOrdered = hakaton.TotalOrdered,
            PaymentType = hakaton.PaymentType,
            IsPaid = hakaton.IsPaid,
            CountItems = hakaton.CountItems,
            UniqueItems = hakaton.UniqueItems,
            AvgUniquePurchase = hakaton.AvgUniquePurchase,
            IsCourier = hakaton.IsCourier,
            NmAge = hakaton.NmAge,
            Distance = hakaton.Distance,
            DaysAfterRegistration = hakaton.DaysAfterRegistration,
            NumberOfOrders = hakaton.NumberOfOrders,
            NumberOfOrderedItems = hakaton.NumberOfOrderedItems,
            MeanNumberOfOrderedItems = hakaton.MeanNumberOfOrderedItems,
            MinNumberOfOrderedItems = hakaton.MinNumberOfOrderedItems,
            MaxNumberOfOrderedItems = hakaton.MaxNumberOfOrderedItems,
            MeanPercentOfOrderedItems = hakaton.MeanPercentOfOrderedItems,
            Service = hakaton.Service,
        };

        return userFraudDetection;
    }

    public static UserFraudDetectionUpdateDto Map(this UserFraudDetection hakaton)
    {
        var userFraudDetection = new UserFraudDetectionUpdateDto
        {
            UserId = hakaton!.UserId,
            NmId = hakaton.NmId,
            TotalOrdered = hakaton.TotalOrdered,
            PaymentType = hakaton.PaymentType,
            IsPaid = hakaton.IsPaid,
            CountItems = hakaton.CountItems,
            UniqueItems = hakaton.UniqueItems,
            AvgUniquePurchase = hakaton.AvgUniquePurchase,
            IsCourier = hakaton.IsCourier,
            NmAge = hakaton.NmAge,
            Distance = hakaton.Distance,
            DaysAfterRegistration = hakaton.DaysAfterRegistration,
            NumberOfOrders = hakaton.NumberOfOrders,
            NumberOfOrderedItems = hakaton.NumberOfOrderedItems,
            MeanNumberOfOrderedItems = hakaton.MeanNumberOfOrderedItems,
            MinNumberOfOrderedItems = hakaton.MinNumberOfOrderedItems,
            MaxNumberOfOrderedItems = hakaton.MaxNumberOfOrderedItems,
            MeanPercentOfOrderedItems = hakaton.MeanPercentOfOrderedItems,
            Service = hakaton.Service,
        };

        return userFraudDetection;
    }
}