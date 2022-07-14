using System;

using Android.App;
using Android.Content.PM;
using Android.Runtime;
using Android.OS;
using Xamarin.TensorFlow.Lite;
using Android.Content;
using Acr.UserDialogs;
using Android.Graphics;
using AndroidX.Core.Content;
using Android;
using System.IO;

namespace PyTorchXam.Droid
{
    [Activity(Label = "PyTorchXam", Icon = "@mipmap/icon", Theme = "@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize )]
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
    {
        public static MainActivity Context;
        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);

            Xamarin.Essentials.Platform.Init(this, savedInstanceState);
            global::Xamarin.Forms.Forms.Init(this, savedInstanceState);
            Context = this;
            UserDialogs.Init(this);
            LoadApplication(new App());
            try {
                var lol = this.Assets.Open("64red.jpg");
                var btmp = BitmapFactory.DecodeStream(lol);
                if (ContextCompat.CheckSelfPermission(this, Manifest.Permission.WriteExternalStorage) == (int)Permission.Granted)
                {
                    // We have permission, go ahead and use the camera.

                    var sdCardPath = Android.OS.Environment.ExternalStorageDirectory.AbsolutePath;
                    
                    var filePath = System.IO.Path.Combine(sdCardPath, "Project/testResult23432.jpg");
                    CheckAppPermissions();
                    CheckSelfPermissions();
                    var stream = new FileStream(filePath, FileMode.Create);
                    
                    btmp.Compress(Bitmap.CompressFormat.Jpeg, 100, stream);
                    stream.Close();
                }
            }
            catch(Exception ex)
            {

            }
            //new Tensorflow().Test(this.Assets );
        }
        public void CheckAppPermissions()
        {
            if ((int)Build.VERSION.SdkInt < 23)
            {
                return;
            }
            else
            {
                if (PackageManager.CheckPermission(Manifest.Permission.ReadExternalStorage, PackageName) != Permission.Granted
                    && PackageManager.CheckPermission(Manifest.Permission.WriteExternalStorage, PackageName) != Permission.Granted
                    && PackageManager.CheckPermission(Manifest.Permission.WriteExternalStorage, PackageName) != Permission.Granted
                    )
                {
                    var permissions = new string[] { Manifest.Permission.ReadExternalStorage, Manifest.Permission.WriteExternalStorage };
                    RequestPermissions(permissions, 1);
                }
            }
        }

        public void CheckSelfPermissions()
        {
            if ((int)Build.VERSION.SdkInt < 23)
            {
                return;
            }
            else
            {
                if (   ContextCompat.CheckSelfPermission(this, Manifest.Permission.ReadExternalStorage) != Permission.Granted
                    && ContextCompat.CheckSelfPermission(this, Manifest.Permission.WriteExternalStorage) != Permission.Granted
                    && ContextCompat.CheckSelfPermission(this, Manifest.Permission.ManageExternalStorage) != Permission.Granted
                    )
                {
                    var permissions = new string[] { Manifest.Permission.ReadExternalStorage, Manifest.Permission.WriteExternalStorage, Manifest.Permission.ManageExternalStorage };
                    RequestPermissions(permissions, 1);
                }
            }
        }
 
        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Android.Content.PM.Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }
}