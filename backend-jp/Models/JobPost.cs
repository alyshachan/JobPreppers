using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class JobPost
{
    public int postID { get; set; }

    public DateTime postDate { get; set; }

    public DateTime endDate { get; set; }

    public string title { get; set; } = null!;

    public string type { get; set; } = null!;

    public string? benefits { get; set; }

    public string? perks { get; set; }

    public string? bonus { get; set; }

    public int minimumSalary { get; set; }

    public int? maximumSalary { get; set; }

    public string? description { get; set; }

    public string paymentType { get; set; } = null!;

    public int employerID { get; set; }

    public int qualificationID { get; set; }

    public string? currency { get; set; }

    public int? numberOfHires { get; set; }

    public string? link { get; set; }

    public int locationID { get; set; }

    public virtual JobEmployer employer { get; set; } = null!;

    public virtual JobLocation location { get; set; } = null!;

    public virtual JobQualification qualification { get; set; } = null!;
}
