using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Interviewer
{
    public int interviewerID { get; set; }

    public int? userID { get; set; }

    public string? specialties { get; set; }

    public string? availability { get; set; }

    public decimal? rating { get; set; }

    public virtual User? user { get; set; }
}
