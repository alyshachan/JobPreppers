using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class userSkill
{
    public int userSkillID { get; set; }

    public int userID { get; set; }

    public int skillID { get; set; }

    public virtual Skill skill { get; set; } = null!;

    public virtual User user { get; set; } = null!;
}
