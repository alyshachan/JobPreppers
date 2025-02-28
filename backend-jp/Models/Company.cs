using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Company
{
    public int companyID { get; set; }

    public int? userID { get; set; }

    public string Name { get; set; } = null!;

    public string? industry { get; set; }

    public virtual ICollection<Recruiter> Recruiters { get; set; } = new List<Recruiter>();

    public virtual User? user { get; set; }
}