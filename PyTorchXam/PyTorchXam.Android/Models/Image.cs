using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Java.Nio;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static Android.Graphics.Bitmap;

namespace PyTorchXam.Droid.Models
{
    public class Image
    {
        private const int FLOAT_SIZE = 4, HEIGHT = 64, WIDTH = 64, PIXEL_SIZE = 3;
        private Bitmap image;
        public Image(Bitmap image)
        {
            this.image = image;
        }

        public Image(List<List<ByteBuffer>> image)
        {
            imageInMatrix = image;
        }

        private ConcurrentBag<ConcurrentBag<ByteBuffer>> imageInMatrixConcurrent = null;

        public ConcurrentBag<ConcurrentBag<ByteBuffer>> ImageInMatrixConcurrent
        {
            get
            {
                if (imageInMatrixConcurrent == null)
                {
                    for(int i =0; i < imageInMatrix.Count; i++)
                    {
                        
                        ConcurrentBag<ByteBuffer> buf = new ConcurrentBag<ByteBuffer>();
                        for (int j = 0; j< imageInMatrix[j].Count; j++)
                        {
                            buf.Add(imageInMatrix[j][i]);
                        }
                        imageInMatrixConcurrent.Add(buf);
                    }
                }
                return this.imageInMatrixConcurrent;
            }
        }


        private ConcurrentDictionary<int,ConcurrentDictionary<int,ByteBuffer>> imageInMatrixDictionaryConcurrent = null;

        public ConcurrentDictionary<int, ConcurrentDictionary<int, ByteBuffer>> ImageInMatrixDictionaryConcurrent
        {
            get
            {
                if (imageInMatrixDictionaryConcurrent == null)
                {
                    imageInMatrixDictionaryConcurrent = new ConcurrentDictionary<int, ConcurrentDictionary<int, ByteBuffer>>();
                    for(int i = 0; i < this.imageInMatrix.Count; i++)
                    {
                        imageInMatrixDictionaryConcurrent.TryAdd(i, new ConcurrentDictionary<int, ByteBuffer>());
                        for (int j = 0; j< this.imageInMatrix[i].Count; j++)
                        {
                            imageInMatrixDictionaryConcurrent[i].TryAdd(j, imageInMatrix[i][j]);
                        }
                    }
                }
                return this.imageInMatrixDictionaryConcurrent;
            }
        }

        private List<List<ByteBuffer>> imageInMatrix = null;

        public List<List<ByteBuffer>> ImageInMatrix
        {
            get
            {
                if (imageInMatrix == null)
                    FillImage();
                return this.imageInMatrix;
            }
        }
        private void FillImage()
        {
            int countElementByW = (this.image.Width % WIDTH) > 0 ? (this.image.Width / WIDTH + 1) : (this.image.Width / WIDTH);
            int countElementByH = (this.image.Height % HEIGHT) > 0 ? (this.image.Height / HEIGHT + 1) : (this.image.Height / HEIGHT);
            Bitmap bmp = Bitmap.CreateBitmap(WIDTH * countElementByW, countElementByH * HEIGHT, Config.Argb8888);
            Canvas cancas = new Canvas(bmp);
            cancas.DrawColor(Color.White);
            for (int w = 0; w < image.Width; w++)
            {
                for (int h = 0; h < image.Height; h++)
                {
                    bmp.SetPixel(w, h, new Color(image.GetPixel(w, h)));
                }
            }
            //до этого места все гуд
            var modelInputSize = FLOAT_SIZE * HEIGHT * WIDTH * PIXEL_SIZE;
            var pixels = new int[bmp.Width * bmp.Height];
            bmp.GetPixels(pixels, 0, bmp.Width, 0, 0, bmp.Width, bmp.Height);

            this.imageInMatrix = new List<List<ByteBuffer>>();
            var aleo = pixels.Where(w => w != -1).ToList();

            List<List<List<Color?>>> colors = new List<List<List<Color?>>>();
            for (int i = 0; i < countElementByW; i++)
            {
                this.imageInMatrix.Add(new List<ByteBuffer>());
                colors.Add(new List<List<Color?>>());
                for (int j = 0; j < countElementByH; j++)
                {
                    colors[i].Add(new List<Color?>());
                    this.imageInMatrix[i].Add(Java.Nio.ByteBuffer.AllocateDirect(4 * 64 * 64 * 3));
                    this.imageInMatrix[i][j].Order(ByteOrder.NativeOrder());
                }
            }

            for (int w = 0; w < bmp.Width; w++)
            {
                for (int h = 0; h < bmp.Height; h++)
                {
                    Color pixelColor = new Color(bmp.GetPixel(h, w));///////////////////
                    colors[h / WIDTH][w / HEIGHT].Add(pixelColor);
                }
            }
            for (int i = 0; i < countElementByW; i++)
            {
                for (int j = 0; j < countElementByH; j++)
                {
                    List<float> R = new List<float>(), G = new List<float>(), B = new List<float>();
                    foreach (var item in colors[i][j])
                    {
                        R.Add((float)(item.Value.R) / (float)255.0);
                        G.Add((float)(item.Value.G) / (float)255.0);
                        B.Add((float)(item.Value.B) / (float)255.0);
                    }
                    foreach (var r in R)
                    {
                        this.imageInMatrix[i][j].PutFloat(r);
                    }
                    foreach (var g in G)
                    {
                        this.imageInMatrix[i][j].PutFloat(g);
                    }
                    foreach (var b in B)
                    {
                        this.imageInMatrix[i][j].PutFloat(b);
                    }
                }
            }
            bmp.Recycle();
        }


        #region old
        private void FillImageOld()
        {
            int countElementByW = (this.image.Width % WIDTH) > 0 ? (this.image.Width / WIDTH + 1) : (this.image.Width / WIDTH);
            int countElementByH = (this.image.Height % HEIGHT) > 0 ? (this.image.Height / HEIGHT + 1) : (this.image.Height / HEIGHT);
            Bitmap bmp = Bitmap.CreateBitmap(WIDTH * countElementByW, countElementByH * HEIGHT, Config.Argb8888);
            Canvas cancas = new Canvas(bmp);
            cancas.DrawColor(Color.White);
            for (int w = 0; w < image.Width; w++)
            {
                for (int h = 0; h < image.Height; h++)
                {
                    bmp.SetPixel(w, h, new Color(image.GetPixel(w, h)));
                }
            }
            //до этого места все гуд
            var modelInputSize = FLOAT_SIZE * HEIGHT * WIDTH * PIXEL_SIZE;
            var pixels = new int[bmp.Width * bmp.Height];
            bmp.GetPixels(pixels, 0, bmp.Width, 0, 0, bmp.Width, bmp.Height);
            List<List<List<Color?>>> colors = new List<List<List<Color?>>>();
            this.imageInMatrix = new List<List<ByteBuffer>>();
            var aleo = pixels.Where(w => w != -1).ToList();
            for (int i = 0; i < countElementByW; i++)
            {
                colors.Add(new List<List<Color?>>());
                this.imageInMatrix.Add(new List<ByteBuffer>());
                var pixel = 0;

                for (int j = 0; j < countElementByH; j++)
                {
                    colors[i].Add(new List<Color?>());
                    this.imageInMatrix[i].Add(Java.Nio.ByteBuffer.AllocateDirect(4 * 64 * 64 * 3));
                    int position = j * HEIGHT + i * WIDTH;
                    List<float> R = new List<float>(), G = new List<float>(), B = new List<float>();
                    for (int imageWidthPos = 0; imageWidthPos < WIDTH; imageWidthPos++)
                    {
                        for (int imageHeightPos = 0; imageHeightPos < HEIGHT; imageHeightPos++)
                        {
                            var getterBpixelPosition = position + imageHeightPos * HEIGHT + imageWidthPos;
                            ////заполнение пустым превышания
                            var color = new Color(pixels[getterBpixelPosition]);
                            colors[i][j].Add(color);
                            R.Add((float)(color.R) / (float)255.0);
                            G.Add((float)(color.G) / (float)255.0);
                            B.Add((float)(color.B) / (float)255.0);
                        }
                    }
                    foreach (var r in R)
                    {
                        this.imageInMatrix[i][j].PutFloat(r);
                    }
                    foreach (var g in G)
                    {
                        this.imageInMatrix[i][j].PutFloat(g);
                    }
                    foreach (var b in B)
                    {
                        this.imageInMatrix[i][j].PutFloat(b);
                    }


                }
            }
            //bmp.Recycle();
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
                color.Add(new Color((int)floatBuffer[i] > 255 ? 255 : (int)floatBuffer[i] < 0 ? 0 : (int)floatBuffer[i],
                    (int)floatBuffer[i + 1] > 255 ? 255 : (int)floatBuffer[i + 1] < 0 ? 0 : (int)floatBuffer[i + 1],
                    (int)floatBuffer[i + 2] > 255 ? 255 : (int)floatBuffer[i + 2] < 0 ? 0 : (int)floatBuffer[i + 2]));

                if (floatBuffer[i] == 0 && floatBuffer[i + 1] == 0 && floatBuffer[i + 2] == 0)
                {
                    var iopg = 1;
                }
            }

            Bitmap bmp = Bitmap.CreateBitmap(200, 200, Config.Argb8888);
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
            //ExportBitmapAsPNG(bmp);
            var pp = 1;
        }
        #endregion
    }
}