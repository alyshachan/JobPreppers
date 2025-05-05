using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Skill
{
    public int skillID { get; set; }

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public virtual ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
}
