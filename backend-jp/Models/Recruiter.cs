using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Recruiter
{
    public int recruiterID { get; set; }

    public int userID { get; set; }

    public int companyID { get; set; }

    public virtual ICollection<JobPost> JobPosts { get; set; } = new List<JobPost>();

    public virtual Company company { get; set; } = null!;

    public virtual User user { get; set; } = null!;
}
