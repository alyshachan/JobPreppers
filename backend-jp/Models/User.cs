using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class User
{
    public int userID { get; set; }

    public string username { get; set; } = null!;

    public string password { get; set; } = null!;

    public string? first_name { get; set; }

    public string? last_name { get; set; }

    public string email { get; set; } = null!;

    public byte[]? profile_pic { get; set; }

    public string? title { get; set; }

    public string? location { get; set; }

    public string? website { get; set; }

    public string? description { get; set; }

    public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();

    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();

    public virtual ICollection<Friend> Friendfriends { get; set; } = new List<Friend>();

    public virtual ICollection<Friend> Friendusers { get; set; } = new List<Friend>();

    public virtual Interviewer? Interviewer { get; set; }

    public virtual Recruiter? Recruiter { get; set; }

    public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();

    public virtual ICollection<UserEducation> UserEducations { get; set; } = new List<UserEducation>();

    public virtual ICollection<UserExperience> UserExperiences { get; set; } = new List<UserExperience>();

    public virtual ICollection<UserProject> UserProjects { get; set; } = new List<UserProject>();

    public virtual ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
}
