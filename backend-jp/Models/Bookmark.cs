using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Bookmark
{
    public int bookmarkID { get; set; }

    public int? JobID { get; set; }

    public int? userID { get; set; }

    public virtual JobPost? Job { get; set; }

    public virtual User? user { get; set; }
}
