using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class JobEmployer
{
    public string companyName { get; set; } = null!;

    public int companyID { get; set; }

    public string? Department { get; set; }

    public virtual ICollection<JobPost> JobPosts { get; set; } = new List<JobPost>();
}
