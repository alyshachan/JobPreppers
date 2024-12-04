using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace JobPreppersDemo.Models;

public partial class userSkill
{
    public int userSkillID { get; set; }

    public int userID { get; set; }

    public int skillID { get; set; }
    [JsonIgnore] // Prevent serialization of the navigation property
    public virtual Skill skill { get; set; } = null!;

    public virtual User user { get; set; } = null!;
}
