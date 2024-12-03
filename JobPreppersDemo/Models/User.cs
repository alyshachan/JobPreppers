using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class User
{
    public int userID { get; set; }

    public string username { get; set; } = null!;

    public string password { get; set; } = null!;

    public string first_name { get; set; } = null!;

    public string last_name { get; set; } = null!;

    public string email { get; set; } = null!;

    public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();

    public virtual ICollection<userSkill> userSkills { get; set; } = new List<userSkill>();
}
