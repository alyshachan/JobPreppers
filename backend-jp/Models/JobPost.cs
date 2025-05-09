﻿using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class JobPost
{
    public int postID { get; set; }

    public DateTime postDate { get; set; }

    public DateTime endDate { get; set; }

    public string title { get; set; } = null!;

    public string type { get; set; } = null!;

    public string? benefits { get; set; }

    public string? perks { get; set; }

    public string? bonus { get; set; }

    public int minimumSalary { get; set; }

    public int? maximumSalary { get; set; }

    public string? description { get; set; }

    public string paymentType { get; set; } = null!;

    public int qualificationID { get; set; }

    public string? currency { get; set; }

    public int? numberOfHires { get; set; }

    public string? link { get; set; }

    public int locationID { get; set; }

    public int recruiterID { get; set; }

    public int companyID { get; set; }

    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();

    public virtual ICollection<Bookmark> Bookmarks { get; set; } = new List<Bookmark>();

    public virtual ICollection<DeleteJob> DeleteJobs { get; set; } = new List<DeleteJob>();

    public virtual Company company { get; set; } = null!;

    public virtual JobLocation location { get; set; } = null!;

    public virtual JobQualification qualification { get; set; } = null!;

    public virtual Recruiter recruiter { get; set; } = null!;

    public virtual ICollection<User> users { get; set; } = new List<User>();
}
