using ErpStore.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ErpStore.Infrastructure.Services;

/// <summary>
/// Servicio en segundo plano que verifica el stock bajo cada hora.
/// Si hay productos con stock bajo y no se ha enviado un reporte en las últimas 8 horas,
/// envía automáticamente el resumen consolidado por correo.
/// </summary>
public class LowStockBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<LowStockBackgroundService> _logger;

    // Intervalo de verificación: cada 1 hora
    private static readonly TimeSpan CheckInterval = TimeSpan.FromHours(1);

    public LowStockBackgroundService(IServiceScopeFactory scopeFactory, ILogger<LowStockBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("[LowStock] Servicio de monitoreo de inventario iniciado. Verificación cada: {interval}h", CheckInterval.TotalHours);

        // Primera ejecución al arrancar (pequeño delay para que la app termine de inicializarse)
        await Task.Delay(TimeSpan.FromSeconds(15), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAndNotify();
            await Task.Delay(CheckInterval, stoppingToken);
        }
    }

    private async Task CheckAndNotify()
    {
        try
        {
            using var scope = _scopeFactory.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            await emailService.ProcessLowStockAlertsAsync();
            _logger.LogInformation("[LowStock] Verificación completada: {time}", DateTime.Now.ToString("HH:mm"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[LowStock] Error en verificación automática de inventario.");
        }
    }
}
