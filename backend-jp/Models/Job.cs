using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Job
{
    public int jobID { get; set; }

    public string title { get; set; } = null!;

    public string? description { get; set; }

    public string company { get; set; } = null!;

    public string type { get; set; } = null!;

    public string? benefits { get; set; }

    public string? perks { get; set; }

    public string? bonus { get; set; }

    public DateTime? postDate { get; set; }

    public int? minimumSalary { get; set; }

    public int? maximumSalary { get; set; }

    public string? location { get; set; }

    public DateTime? endDate { get; set; }

    public int qualificationID { get; set; }

    public int? column_name { get; set; }
}
