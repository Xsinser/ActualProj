using Microsoft.ML;
using System;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.ML.Transforms;
using System.Globalization;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace TestConsole
{
    internal class Program
    {
        class SS
        {
            public int eT = 0;
        }
        static void aser(SS all)
        {
            all.eT = 3;
        }
        static void oper(List<SS> ase)
        {
            aser(ase[0]);
        }
        static void Main(string[] args)
        {
            //List<SS> aser = new List<SS>();
            //aser.Add(new SS() { eT = 34 });
            //oper(aser);
            //var opere = aser[0];

            List<string> unics = new List<string>();
            StreamReader reader = new StreamReader(@"C:\Users\Xsinser\Downloads\Telegram Desktop\bb.txt");
            var str = reader.ReadToEnd().Replace("\n", ",").Replace("\r","");
            unics = str.Split(',').ToList().Select(s => s).Distinct().ToList();
            reader.Close();
            var tret = unics.Where(w => w.Length < 2).ToList();
            StreamWriter writer = new StreamWriter(@"C:\Users\Xsinser\Downloads\Telegram Desktop\uu.txt");
            foreach (var item in unics)
            {
                if (item != "\r" && item != "")
                    writer.WriteLine(item);
                if(item == "fc449f108d46")
                {
                    var trt = 1;
                }
            }
            writer.Close();
            var tt = 1;
            //var aa = DateTime.ParseExact("2021-01-01" + " " + "23:58", "yyyy-MM-dd HH:mm" , CultureInfo.InvariantCulture);
            //string _modelPath = @"D:\Unity Games\Site\MySite\TestConsole\Model";
            //MLContext mlContext = new MLContext();
            //TensorFlowModel tensorFlowModel = mlContext.Model.LoadTensorFlowModel(_modelPath);
            //mlContext.Transforms.
            //var ole = tensorFlowModel.GetModelSchema();
            // new BinFind().exec();
            Console.WriteLine(15 / 4);
        }
    }
}
