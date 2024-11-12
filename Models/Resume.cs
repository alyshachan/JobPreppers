using System;
using System.Collections.Generic;

namespace JobPreppersProto.Models;

public partial class Resume
{
    public int ResumeId { get; set; }

    public int? UserId { get; set; }

    public byte[]? ResumePdf { get; set; }

    public DateTime? UploadDate { get; set; }

    public virtual User? User { get; set; }
}
