using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Event
{
    public int eventID { get; set; }

    public string eventName { get; set; } = null!;

    public DateOnly? eventDate { get; set; }

    public TimeOnly? eventStartTime { get; set; }

    public TimeOnly? eventEndTime { get; set; }

    public int? hostID { get; set; }

    public string? participantID { get; set; }

    public string? eventDetails { get; set; }

    public string? eventLink { get; set; }
}