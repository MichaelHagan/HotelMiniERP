using Microsoft.Extensions.DependencyInjection;
using MediatR;
using FluentValidation;
using System.Reflection;
using HotelMiniERP.Application.Behaviors;
using HotelMiniERP.Application.Services;

namespace HotelMiniERP.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            
            // Register logging behavior
            services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            
            // Register services
            services.AddScoped<ISystemNotificationService, SystemNotificationService>();
            
            return services;
        }
    }
}