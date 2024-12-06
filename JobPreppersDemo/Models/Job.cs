using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models
{
    public class FilterRequest
    {
        public DateTime? Date { get; set; }
        public List<string>? Type { get; set; }

        public List<string>? Company { get; set; }

        public int Min_Salary { get; set; }

    }

}

public partial class Job
{

    public int jobID { get; set; }

    public string title { get; set; } = null!;

    public string location { get; set; } = null!;

    public string? description { get; set; }

    public DateTime? postedAt { get; set; }

    public DateTime fill_by_date { get; set; }

    public string company { get; set; } = null!;

    public string type { get; set; } = null!;

    public string? benefits { get; set; }

    public int min_salary { get; set; }

    public int? max_salary { get; set; }
}
