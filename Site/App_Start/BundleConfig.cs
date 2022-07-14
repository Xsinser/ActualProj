using System.Web;
using System.Web.Optimization;

namespace Site
{
    public class BundleConfig
    {
        // Дополнительные сведения об объединении см. на странице https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/jquery-migrate-1.2.1.min.js",
                        "~/Scripts/jquery.ba-bbq.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryUI").Include(
            "~/Scripts/jquery-ui.min.js")); 
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));


            bundles.Add(new ScriptBundle("~/bundles/Code52").Include(
                        "~/Scripts/jquery.globalize/globalize.js",
                        "~/Scripts/Code52.i18n.js",
                        "~/Language/Language"));

            bundles.Add(new ScriptBundle("~/bundles/Highcharts").Include(
                        "~/Scripts/highcharts.js",
                        "~/Scripts/pattern.js",
                        "~/Scripts/regression.js",
                        "~/Scripts/highcharts-regression.js",
                        "~/Scripts/highcharts-more.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/datepicker").Include(
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/filter.js",
                        "~/Scripts/datepicker.js",
                        "~/Scripts/DateRangesWidget.js",
                        "~/Scripts/jquery.calendarPicker.js"));

            bundles.Add(new ScriptBundle("~/bundles/Index").Include(
                        "~/Scripts/Index.js",
                        "~/Scripts/HighchartsManager.js",
                        "~/Scripts/FabricatorOfElements.js"));

            bundles.Add(new ScriptBundle("~/bundles/Dashboard").Include( 
                        "~/Scripts/FabricatorOfElements.js",
                        "~/Scripts/View/Admin/Dashboard.js"));

            bundles.Add(new ScriptBundle("~/bundles/EditCity").Include(
                        "~/Scripts/FabricatorOfElements.js",
                        "~/Scripts/View/Admin/EditCity.js"));
            bundles.Add(new ScriptBundle("~/bundles/EditShop").Include(
            "~/Scripts/FabricatorOfElements.js",
            "~/Scripts/View/Admin/EditShop.js"));
            bundles.Add(new ScriptBundle("~/bundles/EditZone").Include(
            "~/Scripts/FabricatorOfElements.js",
            "~/Scripts/View/Admin/EditZone.js"));
            bundles.Add(new ScriptBundle("~/bundles/EditCamera").Include(
            "~/Scripts/FabricatorOfElements.js",
            "~/Scripts/View/Admin/EditCamera.js"));
            bundles.Add(new ScriptBundle("~/bundles/daterangepicker").Include(
                        "~/Scripts/moment.min.js",
                        "~/Scripts/daterangepicker.min.js"));

            // Используйте версию Modernizr для разработчиков, чтобы учиться работать. Когда вы будете готовы перейти к работе,
            // готово к выпуску, используйте средство сборки по адресу https://modernizr.com, чтобы выбрать только необходимые тесты.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));



            bundles.Add(new ScriptBundle("~/bundles/popper").Include(
                       "~/Scripts/umd/popper.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/datetimepicker").Include(
                       "~/Scripts/datetimepicker/build/jquery.datetimepicker.full.js"));

            bundles.Add(new ScriptBundle("~/bundles/tree").Include(
                        "~/Scripts/jquery.dynatree.js",
                        "~/Scripts/jquery.dynatree.utilities.js",
                        "~/Scripts/jquery.dynatree.manager.js",
                        "~/Scripts/url.state.manager.js"));

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            bundles.Add(new StyleBundle("~/Content/tree").Include(
                        "~/Content/skin/ui.dynatree.css"));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include(
                        "~/Content/bootstrap.css",
                        "~/Content/bootstrap-theme.css")); 

            bundles.Add(new StyleBundle("~/Content/jqueryUI").Include(
                        "~/Content/themes/base/jquery-ui.css",
                        "~/Content/themes/base/jquery-ui.structure.css",
                        "~/Content/themes/base/jquery-ui.theme.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/icomoon.style.css",
                        "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/common").Include(
                       "~/Content/common.css"));

            bundles.Add(new StyleBundle("~/Content/Login").Include(
                        "~/Content/Login.css"));

            bundles.Add(new StyleBundle("~/Content/Index").Include(
                        "~/Content/Index.css"));

            bundles.Add(new StyleBundle("~/Content/daterangepicker").Include(
                        "~/Content/daterangepicker.css"));

            bundles.Add(new StyleBundle("~/Content/datepicker").Include(
                        "~/Content/datepicker.material.css"));

            bundles.Add(new StyleBundle("~/Content/DateStyles").Include(
                            "~/Content/DateRangesWidget/base.css",
                            "~/Content/themes/filter.css",
                            "~/Content/jquery.calendarPicker.css",
                            "~/Content/datePicker/base.css"

                        ));
        }
    }
}
