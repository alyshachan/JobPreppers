using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class School
{
    public int schoolID { get; set; }

    public string school_name { get; set; } = null!;

    public virtual ICollection<UserEducation> UserEducations { get; set; } = new List<UserEducation>();
}
