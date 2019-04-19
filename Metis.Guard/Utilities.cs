﻿using System.Text;

namespace Metis.Guard
{
    public class Utilities
    {
        public static string CreateMD5(string input, Encoding encoding = null)
        {
            if(encoding == null)
            {
                encoding = Encoding.UTF8;
            }

            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = encoding.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }
    }
}
