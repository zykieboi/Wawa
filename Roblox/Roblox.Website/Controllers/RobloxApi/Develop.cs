using Microsoft.AspNetCore.Mvc;

namespace Roblox.Website.Controllers.RobloxApi;

[ApiController]
[Route("/")]
public class Develop: ControllerBase
{
    [HttpGetBypass("/v1/places/{placeId:long}/symbolic-links")]
    public IActionResult GetPlaceSymbolicLinks(long placeId, string? sortOrder = "Asc", int? limit = 50)
    {
        return Ok(new
        {
            previousPageCursor = (string?)null,
            nextPageCursor = (string?)null,
            data = Array.Empty<string>()
        });
    }

    [HttpPostBypass("/v1/asset/upload")]
    [HttpPost("asset/upload")]
    public async Task<IActionResult> UploadAsset(IFormFile file, [FromForm] string name = "", [FromForm] string description = "", [FromForm] int assetType = 8, [FromForm] long price = 0)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded" });

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { fileName, filePath, size = file.Length, name, description, assetType, price });
    }

    [HttpPostBypass("/v1/image/upload")]
    [HttpPost("image/upload")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromForm] string name = "")
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded" });

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "images");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { fileName, filePath, size = file.Length, name });
    }


    [HttpPostBypass("/develop/upload")]
    [HttpPost("develop/upload")]
    public async Task<IActionResult> DevelopUpload(IFormFile file, [FromForm] string name = "", [FromForm] string description = "", [FromForm] int assetType = 8, [FromForm] long price = 0)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded" });

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { fileName, filePath, size = file.Length, name, description, assetType, price });
    }


    [HttpGetBypass("/v1/gametemplates")]
    [HttpGet("gametemplates")]
    public IActionResult GetGameTemplates()
    {
        return Ok(new
        {
            data = new[]
            {
                new { id = 1, name = "Baseplate", description = "A flat baseplate", maxPlayers = 10 },
                new { id = 2, name = "Flat Terrain", description = "Flat terrain for building", maxPlayers = 10 },
                new { id = 3, name = "Racing", description = "Racing template", maxPlayers = 10 },
                new { id = 4, name = "Obby", description = "Obby template", maxPlayers = 10 },
                new { id = 5, name = "FPS", description = "First person shooter template", maxPlayers = 10 },
            }
        });
    }


    [HttpPostBypass("/v1/universes/create")]
    [HttpPost("universes/create")]
    public IActionResult CreateUniverse([FromBody] object request)
    {
        return Ok(new { universeId = 1, rootPlaceId = 1, name = "My Place", description = "", success = true });
    }

    [HttpGetBypass("/v1/gametemplates")]
    [HttpGetBypass("/v1/avatar-rules")]
    [HttpGet("avatar-rules")]
    public IActionResult GetAvatarRules()
    {
        return Ok(new { data = new object[] { } });
    }

    [HttpGetBypass("/v1/avatar")]
    [HttpGet("avatar")]
    public IActionResult GetAvatar()
    {
        return Ok(new { data = new { scales = new { height = 1, width = 1, head = 1, depth = 1, proportion = 0, bodyType = 0 }, bodyColors = new { head = 1, torso = 1, leftArm = 1, rightArm = 1, leftLeg = 1, rightLeg = 1 }, assets = new object[] { } } });
    }

}
