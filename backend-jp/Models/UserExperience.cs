using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class UserExperience
{
    public int userExperienceID { get; set; }

    public int userID { get; set; }

    public int workID { get; set; }

    public string job_title { get; set; } = null!;

    public DateOnly? start_date { get; set; }

    public DateOnly? end_date { get; set; }

    public string? description { get; set; }

    public virtual User user { get; set; } = null!;

    public virtual Work work { get; set; } = null!;
}
