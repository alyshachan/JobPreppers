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

    public virtual DbSet<Skill> Skills { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<test> tests { get; set; }

    public virtual DbSet<userSkill> userSkills { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.jobID).HasName("PRIMARY");

            entity.Property(e => e.benefits).HasColumnType("text");
            entity.Property(e => e.company).HasMaxLength(100);
            entity.Property(e => e.description).HasColumnType("text");
            entity.Property(e => e.fill_by_date).HasColumnType("datetime");
            entity.Property(e => e.location).HasMaxLength(100);
            entity.Property(e => e.pay_range).HasMaxLength(50);
            entity.Property(e => e.postedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp");
            entity.Property(e => e.title).HasMaxLength(100);
            entity.Property(e => e.type).HasMaxLength(50);
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

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.skillID).HasName("PRIMARY");

            entity.HasIndex(e => e.Name, "Name").IsUnique();

            entity.Property(e => e.Category).HasMaxLength(255);
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

        modelBuilder.Entity<userSkill>(entity =>
        {
            entity.HasKey(e => e.userSkillID).HasName("PRIMARY");

            entity.HasIndex(e => e.skillID, "skillID");

            entity.HasIndex(e => e.userID, "userID");

            entity.HasOne(d => d.skill).WithMany(p => p.userSkills)
                .HasForeignKey(d => d.skillID)
                .HasConstraintName("userSkills_ibfk_2");

            entity.HasOne(d => d.user).WithMany(p => p.userSkills)
                .HasForeignKey(d => d.userID)
                .HasConstraintName("userSkills_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
