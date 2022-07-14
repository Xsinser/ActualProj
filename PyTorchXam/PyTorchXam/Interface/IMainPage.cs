using System;
using System.Collections.Generic;
using System.Text;

namespace PyTorchXam.Interface
{
    public interface IMainPage
    {
        void StartButton_Clicked(string fileFullPath, string fileName);
        void ChoseFile_Clicked(out bool isHavePermission);
    }
}
