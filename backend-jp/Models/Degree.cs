using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Degree
{
    public int degreeID { get; set; }

    public string degree_name { get; set; } = null!;

    public virtual ICollection<UserEducation> UserEducations { get; set; } = new List<UserEducation>();
}
