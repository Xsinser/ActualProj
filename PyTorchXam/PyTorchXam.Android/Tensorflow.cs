using Android;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Content.Res;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using AndroidX.Core.Content;
using Java.IO;
using Java.Lang;
using Java.Nio;
using Java.Nio.Channels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using static Android.Graphics.Bitmap;
using Exception = System.Exception;
using PyTorchXam.Droid.Models;
using Math = System.Math;
using System.Threading.Tasks;

namespace PyTorchXam.Droid
{
    internal class Tensorflow
    {
        MainActivity activity = MainActivity.Context;
        public Tensorflow()
        {
        }

        public void Test(AssetManager manager)
        {
            var lol = manager.Open("64red.jpg");
            var model = new Xamarin.TensorFlow.Lite.Interpreter(GetModelAsMappedByteBuffer());
            var ll = model.GetInputTensor(0);
            model.AllocateTensors();
            var tensor = model.GetInputTensor(0);
            var shape = tensor.Shape();

            var width = shape[2];
            var height = shape[3];
            var output = Java.Nio.ByteBuffer.AllocateDirect(4 * 256 * 256 * 3);//200
            output.Order(ByteOrder.NativeOrder());
            var img = GetPhotoAsByteBufferForESRGANTest(lol, width, height);
            model.Run(img, output);
            SaveAsFileESRGANTest(output);
        }
        public void Exec(string fileFullPath, string fileName)
        {
            try
            {

                var bitmap = BitmapFactory.DecodeFile(fileFullPath);
                var image = new Image(bitmap);
                var output = GetOutputByteBuffer(image.ImageInMatrix.Count, image.ImageInMatrix[0].Count);

                var model = new Xamarin.TensorFlow.Lite.Interpreter(GetModelAsMappedByteBuffer(),32);
                model.AllocateTensors();
                var tensor = model.GetInputTensor(0);
                var shape = tensor.Shape();

                var width = shape[2];
                var height = shape[3];
                //var output = Java.Nio.ByteBuffer.AllocateDirect(4 * 256 * 256 * 3);//200

                //var img = GetPhotoAsByteBufferForESRGAN(lol, width, height);
                for (int i = 0; i < image.ImageInMatrix.Count; i++)
                {
                    for (int j = 0; j < image.ImageInMatrix[0].Count; j++)
                    {
                        model.Run(image.ImageInMatrix[i][j], output[i][j]);
                    }
                }
                ExportBitmapAsPNG(GetBitmap(output, 256), fileFullPath, fileName);
                //model.Run(image.ImageInMatrix[2][2], output[2][2]);
                //var bit = GetBitmap(output[2][2], 256);
                //ExportBitmapAsPNG(bit, fileFullPath, fileName);

                //var tt = manager.List("");
                //var sas = manager.OpenFd(tt[7]);
                //var uri = Java.Net.URI.Create("file:///android_asset/model.tflite");
                //var file = new Java.IO.File(uri: uri);

                //var lol = manager.Open("64.jpg");
                ////var tt = Xamarin.Essentials.Preferences.Get("Project/test.jpg", string.Empty);
                //var sdCardPath = Android.OS.Environment.ExternalStorageDirectory.AbsolutePath;
                //var filePath = System.IO.Path.Combine(sdCardPath, "Project/test.jpg");
                ////var bit = BitmapFactory.DecodeStream(new FileStream("Project/test.jpg", FileMode.Open, FileAccess.Read));
                //var bit = BitmapFactory.DecodeFile(filePath);
                //var image = new Image(bit);
                //var list = image.ImageInMatrix;
                ////SaveAsFileESRGAN(list[1][1]);
                //ExportBitmapAsPNG(GetBitmap(list, 64));
                //ExportBitmapAsPNG(image.testBit);
                //var img = GetPhotoAsByteBufferForESRGAN(lol, 64, 64);
                //SaveAsFileESRGAN(img);

                //Alex2(lol,64,64);
                //var output = GetOutputByteBuffer(list.Count, list[0].Count);
                /* Сборка работает правильно 
                  var img = GetPhotoAsByteBufferForESRGAN(lol, 64, 64);
                  List<List<ByteBuffer>> bfr = new List<List<ByteBuffer>>();
                  bfr.Add( new List<ByteBuffer>() { img,img } );
                  bfr.Add(new List<ByteBuffer>() { img, img });
                  ExportBitmapAsPNG(GetBitmap(bfr, 64));
                */
                //byte[] buffer;
                //var a = 1;
                //var bitmap = BitmapFactory.DecodeStream(lol);
                /*
                var model = new Xamarin.TensorFlow.Lite.Interpreter(GetModelAsMappedByteBuffer());
                var ll = model.GetInputTensor(0);
                model.AllocateTensors();
                var tensor = model.GetInputTensor(0);
                var shape = tensor.Shape();

                var width = shape[2];
                var height = shape[3];
                var output = Java.Nio.ByteBuffer.AllocateDirect(4 * 256 * 256 * 3);//200
 
                var img = GetPhotoAsByteBufferForESRGAN(lol, width, height);
                model.Run(img, output);
                SaveAsFileESRGAN(output);
                */
                // var zol = output;
                //SaveAsFile(output);
            }
            catch (Exception ex)
            {
                var tt = 1;
            }
        }
        public void ExecThreading(string fileFullPath, string fileName)
        {
            try
            {

                var bitmap = BitmapFactory.DecodeFile(fileFullPath);
                var image = new Image(bitmap);
                var output = GetOutputByteBuffer(image.ImageInMatrix.Count, image.ImageInMatrix[0].Count);

                var model = new Xamarin.TensorFlow.Lite.Interpreter(GetModelAsMappedByteBuffer());
                model.AllocateTensors();
                //model.Run(image.ImageInMatrix[2][2], output[2][2]);
                //var bit = GetBitmap(output[2][2], 256); 

                //Forer(image.ImageInMatrix, output);
                //Parallelization(image.ImageInMatrix, output);

                //Tasker(image.ImageInMatrix, output);///гуд

                SyncTasker(image.ImageInMatrix, output);

                //for (int i = 0; i < image.ImageInMatrix.Count; i++)
                //{
                //    for (int j = 0; j < image.ImageInMatrix[0].Count; j++)
                //    {
                //        model.Run(image.ImageInMatrix[i][j], output[i][j]);
                //    }
                //}
                ExportBitmapAsPNG(GetBitmap(output, 256), fileFullPath, fileName);


            }
            catch (Exception ex)
            {
                var tt = 1;
            }
        }

        private void Forer(List<List<ByteBuffer>> input, List<List<ByteBuffer>> output)
        {
            for (int i = 0; i < input.Count; i++)
            {
                for (int j = 0; j < input[0].Count; j++)
                {
                    ThreadingTensorflow(input[i][j], output[i][j]);
                }
            }
        }
        private void SyncTasker(List<List<ByteBuffer>> input, List<List<ByteBuffer>> output)
        {
            int tasks = 4;
            List<List<Map> > map = new List<List<Map>>();
            for(int i = 0; i < tasks; i++)
            {
                map.Add(new List<Map>());
            }
            int curentTask = 0;
            for (int i = 0; i < input.Count; i++)
            {
                for (int j = 0; j < input[0].Count; j++)
                {

                    map[curentTask].Add(new Map() { X = i, Y = j });

                    curentTask++;
                    if (curentTask == tasks)
                    {
                        curentTask = 0;
                    }

                }
            }
            Task[] task =new Task[tasks];
            for (int i = 0; i < tasks; i++)
            {
                // task[i]=(new System.Threading.Tasks.Task(() => ListingTensorflow(input, output, map[i])));
                ListingTensorflow(input, output, map[i]);
            }
            for (int i = 0; i < tasks; i++)
            {
               // task[i].Start();
            }
            //Task.WaitAll(task);
            //ListingTensorflow
        }
        private void Tasker(List<List<ByteBuffer>> input, List<List<ByteBuffer>> output)
        {
            int fullSize = input.Count * input[0].Count;
            int w = input.Count;
            int count = 0;
            int countTheard = 2;
            List<List<Task>> tasks = new List<List<Task>>();
            tasks.Add(new List<Task>());
            for (int i = 0; i < fullSize; i++)
            {
                int x = i / w;
                int y = i - (x * w);

                if (tasks[tasks.Count - 1].Count < countTheard)
                {
                    tasks[tasks.Count - 1].Add(new System.Threading.Tasks.Task(() => ThreadingTensorflow(input[x][y], output[x][y])));
                }
                else
                {
                    count = 0;
                    tasks.Add(new List<Task>());
                    tasks[tasks.Count - 1].Add(new System.Threading.Tasks.Task(() => ThreadingTensorflow(input[x][y], output[x][y])));
                }
                count++;
            }
            try
            {
                for (int i = 0; i < tasks.Count; i++)
                {
                    var arr = tasks[i].ToArray();
                    foreach (var task in arr)
                    {
                        task.Start();
                    }
                    Task.WaitAll(arr);
                    GC.Collect(9, GCCollectionMode.Forced);
                }
            }
            catch (Exception ex)
            {
                var a = 1;
            }
        }
        private void Parallelization(List<List<ByteBuffer>> input, List<List<ByteBuffer>> output)
        {
            int fullSize = input.Count * input[0].Count;
            int w = input.Count;
            Parallel.For(0, fullSize, iterator =>
            {
                int x = iterator / w;
                int y = iterator - (x * w);

                ThreadingTensorflow(input[x][y], output[x][y]);
                GC.Collect(9, GCCollectionMode.Forced);

            });
        }
        class Map
        {
            public int X { get; set; }
            public int Y { get; set; }
        }
        private void ListingTensorflow(List<List<ByteBuffer>> input, List<List<ByteBuffer>> output, List<Map> map)
        {
            var model = new Xamarin.TensorFlow.Lite.Interpreter(GetModelAsMappedByteBuffer());
            model.AllocateTensors();
            var tensor = model.GetInputTensor(0);
            var shape = tensor.Shape();

            var width = shape[2];
            var height = shape[3];
            for (int i = 0; i < map.Count; i++)
            {
                int x = map[i].X;
                int y = map[i].Y;
                model.Run(input[x][y], output[x][y]);
            }
            GC.Collect(3, GCCollectionMode.Forced);
        }
        private void ThreadingTensorflow(ByteBuffer input, ByteBuffer output)
        {
            var model = new Xamarin.TensorFlow.Lite.Interpreter(GetModelAsMappedByteBuffer());
            model.AllocateTensors();
            var tensor = model.GetInputTensor(0);
            var shape = tensor.Shape();

            var width = shape[2];
            var height = shape[3];
            model.Run(input, output);
            GC.Collect(3, GCCollectionMode.Forced);
        }

        private Bitmap GetBitmap(List<List<ByteBuffer>> image, int size)
        {
            int width = image.Count;
            int height = image[0].Count;
            Bitmap bmp = Bitmap.CreateBitmap(width * size, height * size, Config.Argb8888);
            List<List<Bitmap>> parts = new List<List<Bitmap>>();
            for (int i = 0; i < width; i++)
            {
                parts.Add(new List<Bitmap>());
                for (int j = 0; j < height; j++)
                {
                    parts[i].Add(GetBitmap(image[i][j], size));
                }
            }
            for (int i = 0; i < width; i++)
            {

                for (int j = 0; j < height; j++)
                {
                    FillBitmap(ref bmp, parts[i][j], i * size, j * size);
                }
            }
            return bmp;

        }

        private void FillBitmap(ref Bitmap source, Bitmap filler, int positionX, int positionY)
        {
            for (int i = 0; i < filler.Width; i++)
            {
                for (int j = 0; j < filler.Height; j++)
                {
                    source.SetPixel(i + positionX, j + positionY, new Color(filler.GetPixel(i, j)));
                }
            }
        }

        private Bitmap GetBitmap(ByteBuffer image, int imgSize)
        {
            float[] bytes = new float[image.Limit()];
            var result = new byte[image.Capacity()];
            var floatBuffer = new float[image.Capacity() / 4];
            image.Rewind();
            image.Get(result);


            int floaVal = 0;
            for (int i = 0; i < result.Length && floaVal < floatBuffer.Length; i += 4)
            {
                floatBuffer[floaVal] = BitConverter.ToSingle(new[] { result[i], result[i + 1], result[i + 2], result[i + 3] }, 0);
                floaVal++;
            }
            List<Color> color = new List<Color>();
            var size = floatBuffer.Length / 3;
            for (int i = 0; i < size; i += 1)
            {
                //color.Add(new Color((byte)Math.Round((floatBuffer[i] * (float)255.0), MidpointRounding.AwayFromZero),
                //                     (byte)Math.Round((floatBuffer[i + size * 1] * (float)255.0), MidpointRounding.AwayFromZero),
                //                     (byte)Math.Round((floatBuffer[i + size * 2] * (float)255.0), MidpointRounding.AwayFromZero)));
                var r = Math.Round((floatBuffer[i] * (float)255.0), MidpointRounding.AwayFromZero);
                var g = Math.Round((floatBuffer[i + size * 1] * (float)255.0), MidpointRounding.AwayFromZero);
                var b = Math.Round((floatBuffer[i + size * 2] * (float)255.0), MidpointRounding.AwayFromZero);

                color.Add(new Color((byte)(r > 255 ? 255 : r),
                                     (byte)(g > 255 ? 255 : g),
                                     (byte)(b > 255 ? 255 : b)));
            }

            Bitmap bmp = Bitmap.CreateBitmap(imgSize, imgSize, Config.Argb8888);
            Canvas cancas = new Canvas(bmp);
            int colorNum = 0;
            for (int x = 0; x < bmp.Height; x++)
            {
                for (int y = 0; y < bmp.Width; y++)
                {
                    bmp.SetPixel(y, x, color[colorNum++]);
                }
            }

            return bmp;
        }
        private List<List<ByteBuffer>> GetOutputByteBuffer(int width, int height)
        {
            List<List<ByteBuffer>> buffers = new List<List<ByteBuffer>>();
            for (int i = 0; i < width; i++)
            {
                buffers.Add(new List<ByteBuffer>());
                for (int j = 0; j < height; j++)
                {
                    buffers[i].Add(Java.Nio.ByteBuffer.AllocateDirect(4 * 256 * 256 * 3));
                    buffers[i][j].Order(ByteOrder.NativeOrder());
                }
            }
            return buffers;
        }


        void ExportBitmapAsPNG(Bitmap bitmap)
        {
            if (ContextCompat.CheckSelfPermission(activity, Manifest.Permission.WriteExternalStorage) == (int)Permission.Granted)
            {
                // We have permission, go ahead and use the camera.

                var sdCardPath = Android.OS.Environment.ExternalStorageDirectory.AbsolutePath;
                var filePath = System.IO.Path.Combine(sdCardPath, "Project/testResult23.jpg");
                var stream = new FileStream(filePath, FileMode.Create);
                bitmap.Compress(Bitmap.CompressFormat.Jpeg, 100, stream);
                stream.Close();
            }
        }
        void ExportBitmapAsPNG(Bitmap bitmap, string filePath, string fileName)
        {

            if (ContextCompat.CheckSelfPermission(activity, Manifest.Permission.WriteExternalStorage) == (int)Permission.Granted)
            {
                // We have permission, go ahead and use the camera.
                //var truePath = filePath.Replace(fileName, "");
                var parts = fileName.Split('.');
                var sdCardPath = Android.OS.Environment.ExternalStorageDirectory.AbsolutePath;
                var truePath = System.IO.Path.Combine(sdCardPath, ("Project/" + fileName.Replace(parts[parts.Count() - 1], "") + "4x" + "." + parts[parts.Count() - 1]));
                activity.CheckAppPermissions();
                activity.CheckSelfPermissions();
                //var truePath = System.IO.Path.Combine(sdCardPath, "Project/testResult23444.jpg");

                var stream = new FileStream(truePath, FileMode.Create);
                bitmap.Compress(Bitmap.CompressFormat.Jpeg, 100, stream);
                stream.Close();
                //var sdCardPath = Android.OS.Environment.ExternalStorageDirectory.AbsolutePath;
                //var filePath = System.IO.Path.Combine(sdCardPath, "Project/testResult23.jpg");
                //var stream = new FileStream(filePath, FileMode.Create);
                //bitmap.Compress(Bitmap.CompressFormat.Jpeg, 100, stream);
                //stream.Close();
            }
        }

        private MappedByteBuffer Model
        {
            get
            {
                if (_model == null)
                {
                    _model = GetModelAsMappedByteBuffer();
                }
                return _model;
            }
        }

        private MappedByteBuffer _model = null;

        #region old
        private MappedByteBuffer GetModelAsMappedByteBuffer()
        {
            //var assetDescriptor = Application.Context.Assets.OpenFd("model_realesrgan.tflite");
            var assetDescriptor = Application.Context.Assets.OpenFd("model_realesrgan.tflite");
            var inputStream = new FileInputStream(assetDescriptor.FileDescriptor);

            var mappedByteBuffer = inputStream.Channel.Map(FileChannel.MapMode.ReadOnly, assetDescriptor.StartOffset, assetDescriptor.DeclaredLength);

            return mappedByteBuffer;
        }
        private void SaveAsFileESRGAN(ByteBuffer bufer)
        {
            //byte[] bytes = new byte[bufer.Remaining()];
            //bufer.Get(bytes);
            float[] bytes = new float[bufer.Limit()];
            //bufer.Position(3);
            int index = 1;
            // var in_t = bufer.GetInt(index);
            var result = new byte[bufer.Capacity()];
            var floatBuffer = new float[bufer.Capacity() / 4];
            bufer.Rewind();

            bufer.Get(result);


            int floaVal = 0;
            for (int i = 0; i < result.Length && floaVal < floatBuffer.Length; i += 4)
            {
                floatBuffer[floaVal] = BitConverter.ToSingle(new[] { result[i], result[i + 1], result[i + 2], result[i + 3] }, 0);
                floaVal++;
            }
            var opo = floatBuffer.Where(fod => fod >= 256).ToList();
            List<Color> color = new List<Color>();
            var size = floatBuffer.Length / 3;
            for (int i = 0; i < size; i += 1)
            {
                //color.Add(new Color((int)floatBuffer[i] > 1 ? 255 : (int)floatBuffer[i] < 0 ? 0 : (int)floatBuffer[i] * 255,
                //    (int)floatBuffer[i + size * 1] > 1 ? 255 : (int)floatBuffer[i + 1] < 0 ? 0 : (int)floatBuffer[i + 1] * 255,
                //    (int)floatBuffer[i + size * 2] > 1 ? 255 : (int)floatBuffer[i + 2] < 0 ? 0 : (int)floatBuffer[i + 2] * 255));
                //color.Add(new Color((byte)Math.Round((floatBuffer[i] * (float)255.0), MidpointRounding.AwayFromZero),
                //                     (byte)Math.Round((floatBuffer[i + size * 1] * (float)255.0), MidpointRounding.AwayFromZero),
                //                     (byte)Math.Round((floatBuffer[i + size * 2] * (float)255.0), MidpointRounding.AwayFromZero)));
                color.Add(new Color((byte)Math.Round((floatBuffer[i + size * 2] * (float)255.0), MidpointRounding.AwayFromZero),
                     (byte)Math.Round((floatBuffer[i + size * 1] * (float)255.0), MidpointRounding.AwayFromZero),
                     (byte)Math.Round((floatBuffer[i] * (float)255.0), MidpointRounding.AwayFromZero)));
                //color.Add(new Color((byte)Math.Round((floatBuffer[i] ), MidpointRounding.AwayFromZero),
                //                     (byte)Math.Round((floatBuffer[i + size * 1] ), MidpointRounding.AwayFromZero),
                //                     (byte)Math.Round((floatBuffer[i + size * 2] ), MidpointRounding.AwayFromZero)));

            }
            Bitmap bmp = Bitmap.CreateBitmap(256, 256, Config.Argb8888);
            Canvas cancas = new Canvas(bmp);
            int colorNum = 0;
            for (int x = 0; x < bmp.Height; x++)
            {
                for (int y = 0; y < bmp.Width; y++)
                {
                    bmp.SetPixel(y, x, color[colorNum++]);
                }
            }
            //foreach (var item in color)
            //{
            //    cancas.DrawColor(item);
            //}
            ExportBitmapAsPNG(bmp);
            var pp = 1;
        }

        private void SaveAsFileESRGANTest(ByteBuffer bufer)
        {
            //byte[] bytes = new byte[bufer.Remaining()];
            //bufer.Get(bytes);
            float[] bytes = new float[bufer.Limit()];
            //bufer.Position(3);
            int index = 1;
            // var in_t = bufer.GetInt(index);
            var result = new byte[bufer.Capacity()];
            var floatBuffer = new float[bufer.Capacity() / 4];
            bufer.Rewind();

            bufer.Get(result);


            int floaVal = 0;
            for (int i = 0; i < result.Length && floaVal < floatBuffer.Length; i += 4)
            {
                floatBuffer[floaVal] = BitConverter.ToSingle(new[] { result[i], result[i + 1], result[i + 2], result[i + 3] }, 0);
                floaVal++;
            }
            var opo = floatBuffer.Where(fod => fod < 0).ToList();
            List<Color> color = new List<Color>();
            var size = floatBuffer.Length / 3;
            for (int i = 0; i < size; i += 1)
            {
                //color.Add(new Color((byte)Math.Round((int)floatBuffer[i] > 1 ? (float)255.0 : (int)floatBuffer[i] < 0 ? (int)floatBuffer[i] * (float)255.0 : (int)floatBuffer[i] * (float)255.0, MidpointRounding.AwayFromZero),
                //    (byte)Math.Round((int)floatBuffer[i + size * 1] > 1 ? (float)255.0 : (int)floatBuffer[i + size * 1] < 0 ? (int)floatBuffer[i + size * 1] * (float)255.0 : (int)floatBuffer[i + size * 1] * (float)255.0, MidpointRounding.AwayFromZero),
                //    (byte)Math.Round((int)floatBuffer[i + size * 2] > 1 ? (float)255.0 : (int)floatBuffer[i + size * 2] < 0 ? (int)floatBuffer[i + size * 2] * (float)255.0 : (int)floatBuffer[i + size * 2] * (float)255.0, MidpointRounding.AwayFromZero)));

                var r = Math.Round((floatBuffer[i] * (float)255.0), MidpointRounding.AwayFromZero);
                var g = Math.Round((floatBuffer[i + size * 1] * (float)255.0), MidpointRounding.AwayFromZero);
                var b = Math.Round((floatBuffer[i + size * 2] * (float)255.0), MidpointRounding.AwayFromZero);

                color.Add(new Color((byte)(r > 255 ? 255 : r),
                                     (byte)(g > 255 ? 255 : g),
                                     (byte)(b > 255 ? 255 : b)));
                //var r = (byte)Math.Round((floatBuffer[i] * (float)255.0));
                //color.Add(new Color((byte)Math.Round((floatBuffer[i ] * (float)255.0), MidpointRounding.AwayFromZero),
                //     (byte)Math.Round((floatBuffer[i + size * 1] * (float)255.0), MidpointRounding.AwayFromZero),
                //     (byte)Math.Round((floatBuffer[i + size * 2] * (float)255.0), MidpointRounding.AwayFromZero)));

                //                color.Add(new Color(
                //                        (int)floatBuffer[i + 2] > 1 ? 255 : (int)floatBuffer[i + 2] < 0 ? 0 : (int)floatBuffer[i + 2] * 255,

                //    (int)floatBuffer[i + 1] > 1 ? 255 : (int)floatBuffer[i + 1] < 0 ? 0 : (int)floatBuffer[i + 1] * 255,
                //                        (int)floatBuffer[i] > 1 ? 255 : (int)floatBuffer[i] < 0 ? 0 : (int)floatBuffer[i] * 255
                //));

                //color.Add(new Color((byte)Math.Round((floatBuffer[i] ), MidpointRounding.AwayFromZero),
                //                     (byte)Math.Round((floatBuffer[i + size * 1] ), MidpointRounding.AwayFromZero),
                //                     (byte)Math.Round((floatBuffer[i + size * 2] ), MidpointRounding.AwayFromZero)));

            }
            Bitmap bmp = Bitmap.CreateBitmap(256, 256, Config.Argb8888);
            Canvas cancas = new Canvas(bmp);
            int colorNum = 0;
            for (int x = 0; x < bmp.Height; x++)
            {
                for (int y = 0; y < bmp.Width; y++)
                {
                    bmp.SetPixel(y, x, color[colorNum++]);
                }
            }
            //foreach (var item in color)
            //{
            //    cancas.DrawColor(item);
            //}
            ExportBitmapAsPNG(bmp);
            var pp = 1;
        }
        private void SaveAsFile(ByteBuffer bufer)
        {
            //byte[] bytes = new byte[bufer.Remaining()];
            //bufer.Get(bytes);
            float[] bytes = new float[bufer.Limit()];
            bufer.Position(3);
            int index = 1;
            // var in_t = bufer.GetInt(index);
            var result = new byte[bufer.Capacity()];
            var floatBuffer = new float[bufer.Capacity() / 4];
            bufer.Rewind();

            bufer.Get(result);


            int floaVal = 0;
            for (int i = 0; i < result.Length && floaVal < floatBuffer.Length; i += 4)
            {
                floatBuffer[floaVal] = BitConverter.ToSingle(new[] { result[i], result[i + 1], result[i + 2], result[i + 3] }, 0);
                floaVal++;
            }
            var opo = floatBuffer.Where(fod => fod >= 256).ToList();
            List<Color> color = new List<Color>();
            for (int i = 0; i < floatBuffer.Length; i += 3)
            {
                color.Add(new Color((int)floatBuffer[i] > 1 ? 255 : (int)floatBuffer[i] < 0 ? 0 : (int)floatBuffer[i] * 255,
                    (int)floatBuffer[i + 1] > 1 ? 255 : (int)floatBuffer[i + 1] < 0 ? 0 : (int)floatBuffer[i + 1] * 255,
                    (int)floatBuffer[i + 2] > 1 ? 255 : (int)floatBuffer[i + 2] < 0 ? 0 : (int)floatBuffer[i + 2] * 255));

                if (floatBuffer[i] == 0 && floatBuffer[i + 1] == 0 && floatBuffer[i + 2] == 0)
                {
                    var iopg = 1;
                }
            }

            Bitmap bmp = Bitmap.CreateBitmap(256, 256, Config.Argb8888);
            Canvas cancas = new Canvas(bmp);
            int colorNum = 0;
            for (int x = 0; x < bmp.Height; x++)
            {
                for (int y = 0; y < bmp.Width; y++)
                {
                    bmp.SetPixel(y, x, color[colorNum++]);
                }
            }
            //foreach (var item in color)
            //{
            //    cancas.DrawColor(item);
            //}
            ExportBitmapAsPNG(bmp);
            var pp = 1;
        }
        private Float[] GetPhotoAsByteBuffer2(Stream imgReaderStream, int Width, int Height)
        {
            var bitmap = BitmapFactory.DecodeStream(imgReaderStream);
            var modelInputSize = FloatSize * Height * Width * PixelSize;


            var resizedBitmap = Bitmap.CreateScaledBitmap(bitmap, Width, Height, true);

            var byteBuffer = ByteBuffer.AllocateDirect(modelInputSize);
            byteBuffer.Order(ByteOrder.NativeOrder());
            byteBuffer.AsFloatBuffer();
            List<Float> floats = new List<Float>();
            var pixels = new int[bitmap.Width * bitmap.Height];
            resizedBitmap.GetPixels(pixels, 0, resizedBitmap.Width, 0, 0, resizedBitmap.Width, resizedBitmap.Height);


            var pixel = 0;
            for (var i = 0; i < bitmap.Width; i++)
            {
                for (var j = 0; j < bitmap.Height; j++)
                {
                    var pixelVal = pixels[pixel++];
                    var ales = new Color(pixelVal);
                    floats.Add(new Float(ales.R));
                    floats.Add(new Float(ales.G));
                    floats.Add(new Float(ales.B));

                }
            }


            bitmap.Recycle();

            return floats.ToArray();
        }
        private ByteBuffer GetPhotoAsByteBufferForESRGANTest(Stream imgReaderStream, int Width, int Height)
        {
            var bitmap = BitmapFactory.DecodeStream(imgReaderStream);
            var modelInputSize = FloatSize * Height * Width * PixelSize;

            var resizedBitmap = Bitmap.CreateScaledBitmap(bitmap, Width, Height, true);

            var byteBuffer = ByteBuffer.AllocateDirect(modelInputSize);
            byteBuffer.Order(ByteOrder.NativeOrder());

            var pixels = new int[bitmap.Width * bitmap.Height];
            resizedBitmap.GetPixels(pixels, 0, resizedBitmap.Width, 0, 0, resizedBitmap.Width, resizedBitmap.Height);


            var pixel = 0;
            List<float> R = new List<float>(), G = new List<float>(), B = new List<float>();
            for (var i = 0; i < bitmap.Width; i++)
            {
                for (var j = 0; j < bitmap.Height; j++)
                {
                    var pixelVal = pixels[pixel++];
                    var colr = new Color(pixelVal);

                    B.Add((float)(colr.B) / (float)255.0);
                    G.Add((float)(colr.G) / (float)255.0);

                    R.Add((float)(colr.R) / (float)255.0);

                    //R.Add((float)(colr.R));
                    //G.Add((float)(colr.G));
                    //B.Add((float)(colr.B));
                }
            }
            foreach (var r in R)
            {
                byteBuffer.PutFloat(r);
            }
            foreach (var g in G)
            {
                byteBuffer.PutFloat(g);
            }
            foreach (var b in B)
            {
                byteBuffer.PutFloat(b);
            }



            bitmap.Recycle();
            return byteBuffer;
        }
        private ByteBuffer GetPhotoAsByteBufferForESRGAN(Stream imgReaderStream, int Width, int Height)
        {
            var bitmap = BitmapFactory.DecodeStream(imgReaderStream);
            var modelInputSize = FloatSize * Height * Width * PixelSize;

            var resizedBitmap = Bitmap.CreateScaledBitmap(bitmap, Width, Height, true);

            var byteBuffer = ByteBuffer.AllocateDirect(modelInputSize);
            byteBuffer.Order(ByteOrder.NativeOrder());

            var pixels = new int[bitmap.Width * bitmap.Height];
            resizedBitmap.GetPixels(pixels, 0, resizedBitmap.Width, 0, 0, resizedBitmap.Width, resizedBitmap.Height);


            var pixel = 0;
            List<float> R = new List<float>(), G = new List<float>(), B = new List<float>();
            for (var i = 0; i < bitmap.Width; i++)
            {
                for (var j = 0; j < bitmap.Height; j++)
                {
                    var pixelVal = pixels[pixel++];
                    var colr = new Color(pixelVal);
                    R.Add((float)(colr.R) / (float)255.0);
                    G.Add((float)(colr.G) / (float)255.0);
                    B.Add((float)(colr.B) / (float)255.0);

                    //R.Add((float)(colr.R));
                    //G.Add((float)(colr.G));
                    //B.Add((float)(colr.B));
                }
            }
            foreach (var b in B)
            {
                byteBuffer.PutFloat(b);
            }

            foreach (var g in G)
            {
                byteBuffer.PutFloat(g);
            }
            foreach (var r in R)
            {
                byteBuffer.PutFloat(r);
            }
            bitmap.Recycle();
            var tt = R.Where(w => w != 1 && w != 0).ToList();
            return byteBuffer;
        }
        private ByteBuffer GetPhotoAsByteBuffer(Stream imgReaderStream, int Width, int Height)
        {
            var bitmap = BitmapFactory.DecodeStream(imgReaderStream);
            var modelInputSize = FloatSize * Height * Width * PixelSize;

            var resizedBitmap = Bitmap.CreateScaledBitmap(bitmap, Width, Height, true);

            var byteBuffer = ByteBuffer.AllocateDirect(modelInputSize);
            byteBuffer.Order(ByteOrder.NativeOrder());

            var pixels = new int[bitmap.Width * bitmap.Height];
            resizedBitmap.GetPixels(pixels, 0, resizedBitmap.Width, 0, 0, resizedBitmap.Width, resizedBitmap.Height);


            var pixel = 0;

            for (var i = 0; i < bitmap.Width; i++)
            {
                for (var j = 0; j < bitmap.Height; j++)
                {
                    var pixelVal = pixels[pixel++];
                    var a1 = pixelVal >> 16 & 0xFF;
                    var a2 = pixelVal >> 8 & 0xFF;
                    var a3 = pixelVal & 0xFF;
                    var ales = new Color(pixelVal);
                    //byteBuffer.PutFloat((float)(pixelVal >> 16 & 0xFF) / (float)255.0);
                    //byteBuffer.PutFloat((float)(pixelVal >> 8 & 0xFF) / (float)255.0);
                    //byteBuffer.PutFloat((float)(pixelVal & 0xFF) / (float)255.0);
                    byteBuffer.PutFloat((float)(pixelVal >> 16 & 0xFF) / (float)255.0);
                    byteBuffer.PutFloat((float)(pixelVal >> 8 & 0xFF) / (float)255.0);
                    byteBuffer.PutFloat((float)(pixelVal & 0xFF) / (float)255.0);
                }
            }

            bitmap.Recycle();

            return byteBuffer;
        }
        //FloatSize is a constant with the value of 4 because a float value is 4 bytes
        const int FloatSize = 4;
        //PixelSize is a constant with the value of 3 because a pixel has three color channels: Red Green and Blue
        const int PixelSize = 3;
        private ByteBuffer Alex2(Stream imgReaderStream, int Width, int Height)
        {
            var bitmap = BitmapFactory.DecodeStream(imgReaderStream);
            var modelInputSize = FloatSize * Height * Width * PixelSize;

            var resizedBitmap = Bitmap.CreateScaledBitmap(bitmap, Width, Height, true);

            var byteBuffer = ByteBuffer.AllocateDirect(modelInputSize);
            byteBuffer.Order(ByteOrder.NativeOrder());

            var pixels = new int[bitmap.Width * bitmap.Height];
            resizedBitmap.GetPixels(pixels, 0, resizedBitmap.Width, 0, 0, resizedBitmap.Width, resizedBitmap.Height);


            var pixel = 0;
            List<float> R = new List<float>(), G = new List<float>(), B = new List<float>();
            List<Color> clr = new List<Color>();
            for (var i = 0; i < bitmap.Width; i++)
            {
                for (var j = 0; j < bitmap.Height; j++)
                {
                    var pixelVal = pixels[pixel++];
                    var colr = new Color(pixelVal);
                    R.Add((float)(colr.R) / (float)255.0);
                    G.Add((float)(colr.G) / (float)255.0);
                    B.Add((float)(colr.B) / (float)255.0);
                    //clr.Add(new Color(
                    //    (byte)Math.Round((float)(colr.R) / (float)255.0 * (float)255.0, MidpointRounding.AwayFromZero),
                    //    (byte)Math.Round((float)(colr.G) / (float)255.0 * (float)255.0, MidpointRounding.AwayFromZero),
                    //    (byte)Math.Round((float)(colr.B) / (float)255.0 * (float)255.0, MidpointRounding.AwayFromZero)));
                }
            }
            Bitmap bmp = Bitmap.CreateBitmap(64, 64, Config.Argb8888);
            var colorNum = 0;
            for (int x = 0; x < bmp.Height; x++)
            {
                for (int y = 0; y < bmp.Width; y++)
                {
                    bmp.SetPixel(y, x, clr[colorNum++]);
                }
            }
            //ExportBitmapAsPNG(bmp);
            foreach (var r in R)
            {
                byteBuffer.PutFloat(r);
            }
            foreach (var g in G)
            {
                byteBuffer.PutFloat(g);
            }
            foreach (var b in B)
            {
                byteBuffer.PutFloat(b);
            }
            bitmap.Recycle();


            //byteBuffer

            float[] bytes = new float[byteBuffer.Limit()];
            int index = 1;
            var result = new byte[byteBuffer.Capacity()];
            var floatBuffer = new float[byteBuffer.Capacity() / 4];
            byteBuffer.Rewind();

            byteBuffer.Get(result);
            int floaVal = 0;
            for (int i = 0; i < result.Length && floaVal < floatBuffer.Length; i += 4)
            {
                floatBuffer[floaVal] = BitConverter.ToSingle(new[] { result[i], result[i + 1], result[i + 2], result[i + 3] }, 0);
                floaVal++;
            }




            return byteBuffer;
        }
        private ByteBuffer Alex(Stream imgReaderStream, int Width, int Height)
        {
            var bitmap = BitmapFactory.DecodeStream(imgReaderStream);
            var modelInputSize = FloatSize * Height * Width * PixelSize;

            var resizedBitmap = Bitmap.CreateScaledBitmap(bitmap, Width, Height, true);

            var byteBuffer = ByteBuffer.AllocateDirect(modelInputSize);
            byteBuffer.Order(ByteOrder.NativeOrder());

            var pixels = new int[bitmap.Width * bitmap.Height];
            resizedBitmap.GetPixels(pixels, 0, resizedBitmap.Width, 0, 0, resizedBitmap.Width, resizedBitmap.Height);


            var pixel = 0;
            List<float> R = new List<float>(), G = new List<float>(), B = new List<float>();
            List<Color> clr = new List<Color>();
            for (var i = 0; i < bitmap.Width; i++)
            {
                for (var j = 0; j < bitmap.Height; j++)
                {
                    var pixelVal = pixels[pixel++];
                    var colr = new Color(pixelVal);
                    R.Add((float)(colr.R) / (float)255.0);
                    G.Add((float)(colr.G) / (float)255.0);
                    B.Add((float)(colr.B) / (float)255.0);
                    clr.Add(new Color(
                        (byte)Math.Round((float)(colr.R) / (float)255.0 * (float)255.0, MidpointRounding.AwayFromZero),
                        (byte)Math.Round((float)(colr.G) / (float)255.0 * (float)255.0, MidpointRounding.AwayFromZero),
                        (byte)Math.Round((float)(colr.B) / (float)255.0 * (float)255.0, MidpointRounding.AwayFromZero)));
                }
            }
            Bitmap bmp = Bitmap.CreateBitmap(64, 64, Config.Argb8888);
            var colorNum = 0;
            for (int x = 0; x < bmp.Height; x++)
            {
                for (int y = 0; y < bmp.Width; y++)
                {
                    bmp.SetPixel(y, x, clr[colorNum++]);
                }
            }
            ExportBitmapAsPNG(bmp);
            //foreach (var r in R)
            //{
            //    byteBuffer.PutFloat(r);
            //}
            //foreach (var g in G)
            //{
            //    byteBuffer.PutFloat(g);
            //}
            //foreach (var b in B)
            //{
            //    byteBuffer.PutFloat(b);
            //}
            bitmap.Recycle();
            return byteBuffer;
        }
        private ByteBuffer GetPhotoAsByteBuffer(Stream imgReaderStream)
        {
            var bitmap = BitmapFactory.DecodeStream(imgReaderStream);
            var modelInputSize = FloatSize * bitmap.Height * bitmap.Width * PixelSize;


            var resizedBitmap = Bitmap.CreateScaledBitmap(bitmap, bitmap.Width, bitmap.Height, true);

            var byteBuffer = ByteBuffer.AllocateDirect(modelInputSize);
            byteBuffer.Order(ByteOrder.NativeOrder());

            var pixels = new int[bitmap.Width * bitmap.Height];
            resizedBitmap.GetPixels(pixels, 0, resizedBitmap.Width, 0, 0, resizedBitmap.Width, resizedBitmap.Height);

            var pixel = 0;

            for (var i = 0; i < bitmap.Width; i++)
            {
                for (var j = 0; j < bitmap.Height; j++)
                {
                    var pixelVal = pixels[pixel++];
                    var a1 = pixelVal >> 16 & 0xFF;
                    var a2 = pixelVal >> 8 & 0xFF;
                    var a3 = pixelVal & 0xFF;
                    byteBuffer.PutFloat(pixelVal >> 16 & 0xFF);
                    byteBuffer.PutFloat(pixelVal >> 8 & 0xFF);
                    byteBuffer.PutFloat(pixelVal & 0xFF);
                }
            }

            bitmap.Recycle();

            return byteBuffer;
        }
        #endregion
    }
}