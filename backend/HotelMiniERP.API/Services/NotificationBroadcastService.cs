using HotelMiniERP.API.Hubs;
using HotelMiniERP.Application.Services;
using HotelMiniERP.Domain.Entities;
using Microsoft.AspNetCore.SignalR;

namespace HotelMiniERP.API.Services;

public class NotificationBroadcastService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IHubContext<MessagingHub> _hubContext;
    private IServiceScope? _scope;
    private ISystemNotificationService? _notificationService;

    public NotificationBroadcastService(IServiceProvider serviceProvider, IHubContext<MessagingHub> hubContext)
    {
        _serviceProvider = serviceProvider;
        _hubContext = hubContext;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Create a long-lived scope that persists for the lifetime of the service
        _scope = _serviceProvider.CreateScope();
        _notificationService = _scope.ServiceProvider.GetRequiredService<ISystemNotificationService>();

        // Subscribe to notification events
        _notificationService.OnNotificationCreated += BroadcastNotificationAsync;

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        // Unsubscribe from events
        if (_notificationService != null)
        {
            _notificationService.OnNotificationCreated -= BroadcastNotificationAsync;
        }

        // Dispose the scope
        _scope?.Dispose();

        return Task.CompletedTask;
    }

    private async Task BroadcastNotificationAsync(Message message)
    {
        try
        {
            Console.WriteLine($"[NotificationBroadcast] Broadcasting notification ID: {message.Id} to ReceiverId: {message.ReceiverId}");
            
            // Send to specific user if there's a receiver
            if (message.ReceiverId > 0)
            {
                await _hubContext.Clients
                    .Group($"User_{message.ReceiverId}")
                    .SendAsync("NewNotification", message);
                Console.WriteLine($"[NotificationBroadcast] Sent to User_{message.ReceiverId}");
            }
            else
            {
                // Broadcast to all if no specific receiver (e.g., low inventory alerts)
                await _hubContext.Clients.All.SendAsync("NewNotification", message);
                Console.WriteLine($"[NotificationBroadcast] Broadcast to all clients");
            }
        }
        catch (Exception ex)
        {
            // Log error but don't throw - notifications are not critical
            Console.WriteLine($"Error broadcasting notification: {ex.Message}");
        }
    }
}
