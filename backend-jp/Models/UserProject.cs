using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class UserProject
{
    public int projectID { get; set; }

    public int userID { get; set; }

    public string project_title { get; set; } = null!;

    public string? description { get; set; }

    public virtual User user { get; set; } = null!;
}
