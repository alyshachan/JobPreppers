// Need to get embedded and all the info bassed on the userID 

using System.Text;
using JobPreppersDemo.Contexts;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg;
using Org.BouncyCastle.Math.EC.Endo;
using System.Text.Json;
using JobPreppersDemo.Models;

namespace JobPreppersDemo.Services
{
    public class EmbeddedUser
    {

        private readonly ApplicationDbContext _context;
        private readonly JobsVectorDB _vector;

        public EmbeddedUser(ApplicationDbContext context, JobsVectorDB vector)
        {
            _context = context;
            _vector = vector;
        }


        // public async Task search(float[] embeddedUser)
        // {
        //     var response = await _vector.sematicSearch(embeddedUser);
        //     Console.WriteLine($"Results for search: {response}");
        // }

        public async Task AddEmbeddedUser(int userID)
        {
            StringBuilder sb = new StringBuilder();
            // Get User info 
            try
            {

                // Education
                var eduaction = await _context.UserEducations
                .Include(edu => edu.degree)
                .Include(edu => edu.school)
                .Include(edu => edu.study)
                .Where(edu => edu.userID == userID)
                .Select(edu => new
                {
                    degree = edu.degree.degree_name,
                    major = edu.study.study_name,
                    description = edu.description
                }).ToListAsync();
                sb.Append("This is the user education: ");
                foreach (var item in eduaction)
                {
                    sb.Append(" ");
                    sb.Append(item.degree);
                    sb.Append(" for ");
                    sb.Append(item.major);
                    sb.Append(" ");
                    sb.Append(item.description);

                }
                sb.Append(". ");

                //Skills 
                var skills = await _context.UserSkills
                .Where(s => s.userID == userID)
                .Include(s => s.skill)
                .Select(s => new
                {
                    skill = s.skill.Name
                }).ToListAsync();
                sb.Append("User Skills: ");
                foreach (var value in skills)
                {
                    sb.Append(" ");
                    sb.Append(value.skill);
                }
                sb.Append(". ");


                //Experence 
                var experience = await _context.UserExperiences
                .Where(exp => exp.userID == userID)
                .Select(exp => new
                {
                    title = exp.job_title,
                    experience = exp.description
                }).ToListAsync();
                sb.Append("User Experience:");
                foreach (var item in experience)
                {
                    sb.Append(" ");
                    sb.Append(item.title);
                    sb.Append(" description: ");
                    sb.Append(item.experience);
                }
                sb.Append(". ");


                // Project
                var project = await _context.UserProjects
                .Where(p => p.userID == userID)
                .Select(p => new
                {
                    project_title = p.project_title,
                    proj_description = p.description
                }).ToListAsync();
                sb.Append("User Project:");
                foreach (var item in project)
                {
                    sb.Append(" ");
                    sb.Append(item.project_title);
                    sb.Append(" ");
                    sb.Append(item.proj_description);

                }
                // sb.Append("\n");
                sb.Append(". ");


                string finalText = sb.ToString().Replace("B)", "").Replace("•", "");
                Console.WriteLine($"String Builder content: {finalText}");


                // Embed User
                Console.WriteLine("Before Embedding");
                float[] updatedEmbedding = await _vector.embeddedSentence(finalText);
                Console.WriteLine($"User Embedded: [{string.Join(", ", updatedEmbedding)}]");

                //Add or Update table

                // If exist - update 
                var user_exist = await _context.UserEmbeddings.FirstOrDefaultAsync(user => user.userID == userID);
                if (user_exist != null)
                {
                    user_exist.embedding = JsonSerializer.Serialize(updatedEmbedding);
                    _context.UserEmbeddings.Update(user_exist);
                }

                // Add user
                else
                {
                    var user_embedded = new UserEmbedding
                    {
                        userID = userID,
                        embedding = JsonSerializer.Serialize(updatedEmbedding)
                    };
                    await _context.UserEmbeddings.AddAsync(user_embedded);
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Inner Exception: {ex.Message}");
            }

        }

    }

}