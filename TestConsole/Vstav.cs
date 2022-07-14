using System;
using System.Collections.Generic;
using System.Text;

namespace TestConsole
{
    internal class Vstav
    {
        public void exec()
        {
            List<int> mass = new List<int>();
            for(int i = 0; i < 10; i++)
            {
                mass.Add(new Random(i).Next(1,10));
            }
            for(int i = 0; i< mass.Count; i++)
            {
                int val = mass[i];
                int j = i;
                while(j>0 && mass[j - 1] > val)
                {
                    mass[j] = mass[j - 1];
                    j--;
                }
                mass[j] = val;
            }
            foreach(var item in mass)
            {
                Console.WriteLine(item);
            }
        }
    }
}
