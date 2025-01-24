using Microsoft.AspNetCore.Mvc;

namespace JobPreppersDemo.Controllers
{
    public class UserProjectController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
