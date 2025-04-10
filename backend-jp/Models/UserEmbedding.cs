using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class UserEmbedding
{
    public int userID { get; set; }

    public string embedding { get; set; } = null!;

    public virtual User user { get; set; } = null!;
}
