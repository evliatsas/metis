using System.Text;
using System.Text.RegularExpressions;

namespace Metis.Guard
{
    public class Utilities
    {
        /// <summary>
        /// Calculate the MD5 Hash for a given string
        /// </summary>
        /// <param name="input">The source string</param>
        /// <param name="encoding">The text encoding (default is UTF-8)</param>
        /// <returns>MD5 Hash</returns>
        public static string CreateMD5(string input, Encoding encoding = null)
        {
            if(encoding == null)
            {
                encoding = Encoding.UTF8;
            }

            // remove all white spaces and new lines
            input = Regex.Replace(input, @"\s+", "");

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
