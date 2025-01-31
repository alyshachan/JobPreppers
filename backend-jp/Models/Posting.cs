using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Posting
{
    public int postID { get; set; }

    public DateTime post_date { get; set; }

    public DateTime? closing_date { get; set; }

    public string? rate { get; set; }

    public string? currency { get; set; }

    public int minimum_salary { get; set; }

    public int? maximum_salary { get; set; }

    public int? application_link { get; set; }

    public string location { get; set; } = null!;

    public double? longitude { get; set; }

    public double? latitude { get; set; }
}
