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

    public virtual ICollection<JobQualification> JobQualifications { get; set; } = new List<JobQualification>();

    public virtual ICollection<Posting> Postings { get; set; } = new List<Posting>();
}
