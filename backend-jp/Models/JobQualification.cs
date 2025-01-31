using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class JobQualification
{
    public int postID { get; set; }

    public int jobID { get; set; }

    public string? education { get; set; }

    public int minimum_experience { get; set; }

    public bool? work_visa_required { get; set; }

    public bool? authorizedToWork { get; set; }

    public string skills { get; set; } = null!;

    public virtual Job job { get; set; } = null!;

    public virtual Posting post { get; set; } = null!;
}
