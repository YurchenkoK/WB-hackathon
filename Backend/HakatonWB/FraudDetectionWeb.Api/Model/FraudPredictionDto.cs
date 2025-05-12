using System.Text.Json.Serialization;

namespace FraudDetectionWeb.Api.Model;

public class FraudPredictionDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("prediction")]
    public int Prediction { get; set; }

    [JsonPropertyName("confidence")]
    public double Confidence { get; set; }
}
