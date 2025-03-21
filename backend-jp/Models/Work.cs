using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Work
{
    public int workID { get; set; }

    public string work_name { get; set; } = null!;

    public string? location { get; set; }

    public virtual ICollection<UserExperience> UserExperiences { get; set; } = new List<UserExperience>();
}
