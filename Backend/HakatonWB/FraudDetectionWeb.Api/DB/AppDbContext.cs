using FraudDetectionWeb.Api.Model;
using Microsoft.EntityFrameworkCore;

namespace FraudDetectionWeb.Api.DB;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<UserFraudDetection> UserFraudDetections { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserFraudDetection>()
            .HasKey(h => h.Id);
        
        base.OnModelCreating(modelBuilder);
    }
}