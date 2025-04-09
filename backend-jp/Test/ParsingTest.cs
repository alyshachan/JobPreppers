using System.Text.RegularExpressions;
using ZstdSharp.Unsafe;

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


    public static void Skills()
    {
        HashSet<string> rawSkills = new HashSet<string>();
        rawSkills.Add(" C# .NET, React, and cloud technologies");
        rawSkills.Add(" CI/CD pipelines, containerization");
        rawSkills.Add("SQL,");
        rawSkills.Add("React and");
        HashSet<string> finishedSkills = new HashSet<string>();

        foreach (var skill in rawSkills)
        {
            var normalizeSkills = Regex.Split(skill, @"\s*,\s*|\s+and\s?|\s+or\s?", RegexOptions.IgnoreCase).Select(s => s.Trim())
                                   .Where(s => !string.IsNullOrEmpty(s))  // Remove empty strings
                                   .ToList();
            foreach (var newSkill in normalizeSkills)
            {
                Console.WriteLine($"Input: {skill} -> Extracted skills: {newSkill}");
                // Console.WriteLine("");
                finishedSkills.Add(newSkill);
            }
        }
    }
}