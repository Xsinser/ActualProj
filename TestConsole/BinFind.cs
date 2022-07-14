using System;
using System.Collections.Generic;
using System.Text;

namespace TestConsole
{
    internal class BinFind
    {
        public void exec()
        {
            List<int> mass = new List<int>();
            int toFind = 8;
            for (int i = 0; i < 10; i++)
            {
                mass.Add(i);
            }
            var center = 10 / 2;
            bool finded = false;
            while (!finded)
            {
                //if (mass.Count > center + 1)
                {
                    if (toFind > mass[center])
                    {
                        center += (10 - center) / 2;
                    }
                    else
                    if (toFind == mass[center])
                    {
                        Console.WriteLine(center);
                        finded = true;
                    }
                    else
                    if (toFind < mass[center])
                    {
                        center -= (center) / 2;

                    }
                    else
                    if (toFind == mass[center])
                    {
                        Console.WriteLine(center);
                        finded = true;
                    }
                }
            }

        }
    }
}
