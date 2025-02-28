using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class JobQualification
{
    public int qualID { get; set; }

    public string? EducationLevel { get; set; }

    public int? MinimumExperience { get; set; }

    public int? MaximumExperience { get; set; }

    public bool? WorkVisaRequired { get; set; }

    public bool? AuthorizedToWork { get; set; }

    public string Skills { get; set; } = null!;

    public virtual ICollection<JobPost> JobPosts { get; set; } = new List<JobPost>();
}
