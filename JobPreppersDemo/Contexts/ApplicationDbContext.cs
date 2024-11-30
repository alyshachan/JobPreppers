using System;
using System.Collections.Generic;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace JobPreppersDemo.Contexts;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Job> Jobs { get; set; }

    public virtual DbSet<Resume> Resumes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<test> tests { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=jobprepperscapstone.cbgwos8q0ls4.us-east-2.rds.amazonaws.com;database=JobPreppersDB;port=3307;user id=JobPrepper;password=ILoveCanes2025!;sslmode=None", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.39-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.jobID).HasName("PRIMARY");

            entity.Property(e => e.company).HasMaxLength(100);
            entity.Property(e => e.description).HasColumnType("text");
            entity.Property(e => e.fill_by_date).HasColumnType("datetime");
            entity.Property(e => e.location).HasMaxLength(100);
            entity.Property(e => e.pay_range).HasMaxLength(50);
            entity.Property(e => e.postedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp");
            entity.Property(e => e.title).HasMaxLength(100);
        });

        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasKey(e => e.resumeID).HasName("PRIMARY");

            entity.ToTable("Resume");

            entity.HasIndex(e => e.userID, "userID");

            entity.Property(e => e.resume_pdf).HasColumnType("blob");
            entity.Property(e => e.upload_date)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp");

            entity.HasOne(d => d.user).WithMany(p => p.Resumes)
                .HasForeignKey(d => d.userID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Resume_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.userID).HasName("PRIMARY");

            entity.HasIndex(e => e.email, "email").IsUnique();

            entity.HasIndex(e => e.username, "username").IsUnique();

            entity.Property(e => e.email).HasMaxLength(100);
            entity.Property(e => e.first_name).HasMaxLength(50);
            entity.Property(e => e.last_name).HasMaxLength(50);
            entity.Property(e => e.password).HasMaxLength(255);
            entity.Property(e => e.username).HasMaxLength(50);
        });

        modelBuilder.Entity<test>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("test");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
