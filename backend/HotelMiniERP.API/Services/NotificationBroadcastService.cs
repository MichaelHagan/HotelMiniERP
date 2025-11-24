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
            // Check if it's a broadcast message
            if (message.MessageType == Domain.Enums.MessageType.Broadcast)
            {
                // Send to all users
                await _hubContext.Clients.All.SendAsync("NewNotification", message);
                Console.WriteLine($"[NotificationBroadcast] Broadcast message {message.Id} sent to all users");
            }
            else if (message.ReceiverId.HasValue && message.ReceiverId.Value > 0)
            {
                // Send to specific user
                await _hubContext.Clients
                    .Group($"User_{message.ReceiverId.Value}")
                    .SendAsync("NewNotification", message);
                Console.WriteLine($"[NotificationBroadcast] Message {message.Id} sent to User_{message.ReceiverId.Value}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error broadcasting notification: {ex.Message}");
        }
    }
}
