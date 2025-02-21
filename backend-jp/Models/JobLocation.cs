using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class JobLocation
{
    public int locationID { get; set; }

    public string name { get; set; } = null!;

    public double? longitude { get; set; }

    public double? latitude { get; set; }

    public virtual ICollection<JobPost> JobPosts { get; set; } = new List<JobPost>();
}
