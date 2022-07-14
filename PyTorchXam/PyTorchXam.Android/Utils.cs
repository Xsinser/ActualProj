using Android.App;
using Android.Content;
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

namespace PyTorchXam.Droid
{
    public static class Utils
    {
        public static string GetDictionaryKay(int x, int y)
        {
            return x + "." + y;
        }
        public static List<List<ByteBuffer>> Convert(ConcurrentDictionary<int, ConcurrentDictionary<int, ByteBuffer>> dictionary)
        {
            List<List<ByteBuffer>> buf = new List<List<ByteBuffer>>();

            for (int i = 0; i < dictionary.Count; i++)
            {
                buf.Add(new List<ByteBuffer>());
                for (int j = 0; j < dictionary[i].Count; j++)
                {
                    buf[i].Add(dictionary[i][j]);
                }
            }
            return buf;
        }
    }
}