using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class DeleteJob
{
    public int deleteID { get; set; }

    public int jobID { get; set; }

    public int userID { get; set; }

    public virtual JobPost job { get; set; } = null!;

    public virtual User user { get; set; } = null!;
}
