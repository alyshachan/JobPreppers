using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Application
{
    public int userID { get; set; }

    public int recruiterID { get; set; }

    public int jobPostID { get; set; }

    public virtual JobPost jobPost { get; set; } = null!;

    public virtual Recruiter recruiter { get; set; } = null!;

    public virtual User user { get; set; } = null!;
}
