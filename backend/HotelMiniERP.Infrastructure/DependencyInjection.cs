using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using HotelMiniERP.Application.Interfaces;
using HotelMiniERP.Infrastructure.Data;
using HotelMiniERP.Infrastructure.Services;

namespace HotelMiniERP.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
                )
            );

            services.AddScoped<IApplicationDbContext>(provider => provider.GetService<ApplicationDbContext>()!);

            services.AddScoped<IPasswordHashService, PasswordHashService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();

            return services;
        }
    }
}