using Microsoft.AspNetCore.Mvc;

namespace JobPreppersProto.Controllers
{
    public class UsersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
