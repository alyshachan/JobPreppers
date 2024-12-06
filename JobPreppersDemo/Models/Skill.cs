using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace JobPreppersDemo.Models;

public partial class Skill
{
    public int skillID { get; set; }

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    [JsonIgnore] // Prevent serialization of the navigation property
    public virtual ICollection<userSkill> userSkills { get; set; } = new List<userSkill>();
}
