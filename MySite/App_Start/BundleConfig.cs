using System.Web;
using System.Web.Optimization;

namespace MySite
{
    public class BundleConfig
    {
        // Дополнительные сведения об объединении см. на странице https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new Bundle("~/bundles/popper").Include(
           "~/Scripts/umd/popper.js",
           "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/Home/Form").Include(
            "~/Scripts/Home/Form.js"));
            // Используйте версию Modernizr для разработчиков, чтобы учиться работать. Когда вы будете готовы перейти к работе,
            // готово к выпуску, используйте средство сборки по адресу https://modernizr.com, чтобы выбрать только необходимые тесты.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include(
            "~/Content/bootstrap.css",
            "~/Content/bootstrap-theme.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include( 
                      "~/Content/site.css"));

        }
    }
}
