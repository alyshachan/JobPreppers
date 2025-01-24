using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace JobPreppersDemo.Models;

public partial class UserEducation
{
    public int userEducationID { get; set; }

    public int userID { get; set; }

    public int schoolID { get; set; }

    public int? degreeID { get; set; }

    public int? studyID { get; set; }

    public DateOnly? start_date { get; set; }

    public DateOnly? end_date { get; set; }

    public string? description { get; set; }

    [JsonIgnore] // Ignore to avoid circular references
    public virtual Degree? degree { get; set; }

    [JsonIgnore] // Ignore to avoid circular references
    public virtual School school { get; set; } = null!;

    [JsonIgnore] // Ignore to avoid circular references
    public virtual Study? study { get; set; }

    [JsonIgnore] // Ignore to avoid circular references
    public virtual User user { get; set; } = null!;
}
