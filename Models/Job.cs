using System;
using System.Collections.Generic;

namespace JobPreppersProto.Models;

public partial class Job
{
    public int JobId { get; set; }

    public string Title { get; set; } = null!;

    public string Location { get; set; } = null!;

    public string PayRange { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? PostedAt { get; set; }

    public DateTime FillByDate { get; set; }

    public string Company { get; set; } = null!;
}
