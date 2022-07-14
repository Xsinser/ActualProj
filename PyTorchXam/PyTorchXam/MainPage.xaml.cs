using Acr.UserDialogs;
using PyTorchXam.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xamarin.Essentials;
using Xamarin.Forms;
namespace PyTorchXam
{
    public partial class MainPage : ContentPage
    {
        FileResult file;
        public MainPage()
        {
            InitializeComponent();
        }

        private async void StartButton_Clicked(object sender, EventArgs e)
        {
            Task shower = new Task(() =>
            {
                UserDialogs.Instance.ShowLoading("loading");
            });

            shower.Start();
            Task task = new Task(() =>
            {
                DependencyService.Get<IMainPage>().StartButton_Clicked(file.FullPath, file.FileName);
                UserDialogs.Instance.HideLoading();
            });
            task.Start();
            //await transform();
            //UserDialogs.Instance.HideLoading();
            //Thread.Sleep(80000);
        }
        private async Task transform()
        {

            var Start = DateTime.Now;
            //UserDialogs.Instance.HideLoading();
            Task task = new Task(() => { DependencyService.Get<IMainPage>().StartButton_Clicked(file.FullPath, file.FileName); });
            task.Start();
            task.Wait();
            var res = DateTime.Now - Start;
            l2.Text = res.TotalSeconds.ToString();
        }

        private async void ChoseFile_Clicked(object sender, EventArgs e)
        {
            var alex = DependencyService.Get<IMainPage>();
            bool premissions = false;
            DependencyService.Get<IMainPage>().ChoseFile_Clicked(out premissions);
            var filePickerType = new FilePickerFileType(new Dictionary<DevicePlatform, IEnumerable<string>> { { DevicePlatform.Android, new[] { ".jpg", ".jpeg" } } });
            var options = new PickOptions() { PickerTitle = "Please select a file" };
            file = await FilePicker.PickAsync();
            var a = 1;
        }
    }
}
