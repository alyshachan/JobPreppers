using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Resume
{
    public int resumeID { get; set; }

    public int? userID { get; set; }

    public byte[]? resume_pdf { get; set; }

    public DateTime? upload_date { get; set; }

    public virtual User? user { get; set; }
}
