using Android;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using AndroidX.Core.App;
using AndroidX.Core.Content;
using Google.Android.Material.Snackbar;
using PyTorchXam.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xamarin.Essentials;
using Xamarin.Forms;

[assembly: Dependency(typeof(PyTorchXam.Droid.Controllers.MainPageController))]
namespace PyTorchXam.Droid.Controllers
{
    public class MainPageController : IMainPage
    {
        public void StartButton_Clicked(string fileFullPath, string fileName)
        {
            //new Tensorflow().Exec(fileFullPath, fileName);
            new Tensorflow().Exec(fileFullPath, fileName);
            return;
        }

        public void ChoseFile_Clicked(out bool isHavePermission)
        {

            isHavePermission = RequestLocationPermission();
        }

        private bool PermissionCheck(string premission)
        {
            return ContextCompat.CheckSelfPermission(MainActivity.Context, premission) == (int)Permission.Granted;
        }
        private bool RequestLocationPermission()
        {
            if (PermissionCheck(Manifest.Permission.WriteExternalStorage) && PermissionCheck(Manifest.Permission.ReadExternalStorage))
            {
                return true;
            }
            else
            {
                ActivityCompat.RequestPermissions(MainActivity.Context, new string[] { Manifest.Permission.WriteExternalStorage, Manifest.Permission.ReadExternalStorage }, 1);
                if (PermissionCheck(Manifest.Permission.WriteExternalStorage) && PermissionCheck(Manifest.Permission.ReadExternalStorage))
                {
                    return true;
                }
                {
                    return false;
                }
            }
        }
    }
}