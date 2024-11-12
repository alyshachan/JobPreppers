using Microsoft.AspNetCore.Mvc;

namespace JobPreppersProto.Controllers
{
    public class JobsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
