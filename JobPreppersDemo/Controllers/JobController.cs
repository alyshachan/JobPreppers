using Microsoft.AspNetCore.Mvc;

namespace JobPreppersDemo.Controllers
{
    public class JobController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
