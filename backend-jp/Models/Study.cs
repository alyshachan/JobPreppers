using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Study
{
    public int studyID { get; set; }

    public string study_name { get; set; } = null!;

    public virtual ICollection<UserEducation> UserEducations { get; set; } = new List<UserEducation>();
}
