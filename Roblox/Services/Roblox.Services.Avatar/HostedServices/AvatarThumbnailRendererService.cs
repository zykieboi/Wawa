using Dapper;
using Npgsql;
using Roblox.Rendering;

namespace Roblox.Services.Avatar.HostedServices;

public class AvatarThumbnailRendererService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AvatarThumbnailRendererService> _logger;
    private readonly string _renderBaseUrl;

    public AvatarThumbnailRendererService(
        IServiceScopeFactory scopeFactory,
        ILogger<AvatarThumbnailRendererService> logger,
        IConfiguration configuration)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _renderBaseUrl = configuration["Render__BaseUrl"] ?? "http://localhost:3521";
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        RenderHttpClient.Configure(_renderBaseUrl, string.Empty);
        _logger.LogInformation("Avatar renderer configured with {Url}", _renderBaseUrl);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<NpgsqlConnection>();
                
                var users = await db.QueryAsync<long>(
                    "SELECT user_id FROM user_avatar WHERE thumbnail_3d_url IS NULL OR thumbnail_3d_url = '' LIMIT 10");
                
                foreach (var userId in users)
                {
                    try
                    {
                        var avatarData = await db.QueryFirstOrDefaultAsync<AvatarData>(
                            "SELECT head_color_id, torso_color_id, right_arm_color_id, left_arm_color_id, right_leg_color_id, left_leg_color_id, scale_height, scale_width, scale_head, scale_depth, scale_proportion, scale_body_type, avatar_type FROM user_avatar WHERE user_id = @userId",
                            new { userId });
                        
                        if (avatarData == null) continue;

                        var renderRequest = new RenderRequest
                        {
                            Kind = RenderKind.Avatar,
                            Width = 420,
                            Height = 420,
                            AvatarRigType = AvatarRigType.R6,
                        };

                        var result = await RenderHttpClient.SendBytesAsync(renderRequest, stoppingToken);
                        
                        if (result != null && result.Data != null && result.Data.Length > 0)
                        {
                            var fileName = $"avatar_3d_{userId}.png";
                            var filePath = Path.Combine("/srv/app/api/public", fileName);
                            await File.WriteAllBytesAsync(filePath, result.Data, stoppingToken);
                            
                            await db.ExecuteAsync(
                                "UPDATE user_avatar SET thumbnail_3d_url = @url WHERE user_id = @userId",
                                new { url = $"/{fileName}", userId });
                            
                            _logger.LogInformation("Rendered 3D avatar for user {UserId}", userId);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to render avatar for user {UserId}", userId);
                    }
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in avatar renderer loop");
            }
            
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
    
    private class AvatarData
    {
        public int head_color_id { get; set; }
        public int torso_color_id { get; set; }
        public int right_arm_color_id { get; set; }
        public int left_arm_color_id { get; set; }
        public int right_leg_color_id { get; set; }
        public int left_leg_color_id { get; set; }
        public double scale_height { get; set; }
        public double scale_width { get; set; }
        public double scale_head { get; set; }
        public double scale_depth { get; set; }
        public double scale_proportion { get; set; }
        public double scale_body_type { get; set; }
        public int avatar_type { get; set; }
    }
}
