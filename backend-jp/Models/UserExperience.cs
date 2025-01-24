using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

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
    [JsonIgnore]
    public virtual User user { get; set; } = null!;
    [JsonIgnore]
    public virtual Work work { get; set; } = null!;
}
