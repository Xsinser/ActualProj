using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MySite.Controllers
{
    public class ProjectsController : Controller
    {
        // GET: Projects
        public ActionResult Classic2048()
        {
            return View();
        }
        public ActionResult PositionConverter()
        {
            return View();
        }
        public ActionResult XianXiaSimulator()
        {
            return View();
        }
    }
}