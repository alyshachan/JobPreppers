using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Recruiter
{
    public int recruiterID { get; set; }

    public int userID { get; set; }

    public int? companyID { get; set; }

    public virtual Company? company { get; set; }

    public virtual User user { get; set; } = null!;
}
