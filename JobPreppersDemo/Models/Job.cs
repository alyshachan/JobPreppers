using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Job
{
    public int jobID { get; set; }

    public string title { get; set; } = null!;

    public string location { get; set; } = null!;

    public string pay_range { get; set; } = null!;

    public string? description { get; set; }

    public DateTime? postedAt { get; set; }

    public DateOnly fill_by_date { get; set; }

    public string company { get; set; } = null!;

    public string type { get; set; } = null!;
}
