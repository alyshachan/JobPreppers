using System.Text.RegularExpressions;

class Test
{
    public static void Experience()
    {

        string[] experience = { "1-", "2 years", "10- years", "3-", "5+", "4- years", "6 months", "1-3 years", "2-5+" };

        string experiencePattern = @"(?<experience>\d+)";

        foreach (var input in experience)
        {
            Match match = Regex.Match(input, experiencePattern);
            if (match.Success && int.TryParse(match.Groups["experience"].Value, out int parseSalary))
            {
                Console.WriteLine($"Input: {input} -> Extracted Experience: {parseSalary}");
            }
            else
            {
                Console.WriteLine($"Input: {input} -> No valid experience found.");
            }
        }

    }


    public static void Salary()
    {

        string[] salary = { "10.00", "10000", "100k", "$100000", "100,000", "400000-500000", "15.00 per hours" };

        string salaryPattern = @"(?<salary>\d+)";

        foreach (var input in salary)
        {
            Match match = Regex.Match(input, salaryPattern);
            if (match.Success && int.TryParse(match.Groups["salary"].Value, out int parseSalary))
            {

                if (input.ToLower().Contains("k") || input.Contains(","))
                {
                    parseSalary *= 1000;
                    Console.WriteLine($"Input: {input} -> Extracted Salary: {parseSalary}");
                    continue;
                }

                Console.WriteLine($"Input: {input} -> Extracted Salary: {parseSalary}");
            }
            else
            {
                Console.WriteLine($"Input: {input} -> No valid experience found.");
            }
        }

    }



}