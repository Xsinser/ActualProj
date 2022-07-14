using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MySite.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        { 

            return View();
        }

        [HttpPost]
        public ActionResult SendForm()
        {

            return null;
        }
        [HttpGet]
        public ActionResult Form()
        {

            return View();
        }
    }
}