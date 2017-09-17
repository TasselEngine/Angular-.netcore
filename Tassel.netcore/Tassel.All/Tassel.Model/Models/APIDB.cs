using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace Tassel.DomainModel.Models {
    public class APIDB : DbContext {

        public APIDB(DbContextOptions<APIDB> options) : base(options) {

        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);
        }

    }

    public static class DbHelper {

        public static void SetSeedData(IServiceProvider serviceProvider) {
            var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
            using (var scope = scopeFactory.CreateScope()) {
                var context = scope.ServiceProvider.GetRequiredService<APIDB>();
                // rest of your code
            //}
            //using (var context = new APIDB(
            //   serviceProvider.GetRequiredService<DbContextOptions<APIDB>>())) {

                context.Database.EnsureCreated();

                if (!context.Roles.Any()) {
                    context.Roles.AddRange(
                        new Role {
                            ID = 1,
                            Name = "User",
                            Description = "The users group."
                        },
                        new Role {
                            ID = 2,
                            Name = "Admin",
                            Description = "High access of this service to control other users."
                        },
                        new Role {
                            ID = 3,
                            Name = "CORE",
                            Description = "The highest access of this web service."
                        });
                    context.SaveChanges();
                }

                if (!context.Users.Any()) {
                    context.Users.AddRange(
                        new User {
                            UUID = IdentityProvider.CreateGuid(GuidType.N),
                            UserName = "miao17game",
                            FamilyName = "Sun",
                            GivenName = "Wallace",
                            Password = IdentityProvider.CreateMD5("2w3e4r5t"),
                            Gender = Gender.Male,
                            Avatar = "/images/avatar/default/alberteinstein.png",
                            RoleID = 3,
                        },
                        new User {
                            UUID = IdentityProvider.CreateGuid(GuidType.N),
                            UserName = "admin",
                            Password = IdentityProvider.CreateMD5("12345678"),
                            Gender = Gender.Female,
                            Avatar = "/images/avatar/default/chunli.png",
                            RoleID = 2,
                        },
                        new User {
                            UUID = IdentityProvider.CreateGuid(GuidType.N),
                            UserName = "user000001",
                            Password = IdentityProvider.CreateMD5("12345678"),
                            Gender = Gender.Male,
                            Avatar = "/images/avatar/default/man.png",
                            RoleID = 1,
                        },
                        new User {
                            UUID = IdentityProvider.CreateGuid(GuidType.N),
                            UserName = "user000002",
                            Password = IdentityProvider.CreateMD5("12345678"),
                            Gender = Gender.Female,
                            Avatar = "/images/avatar/default/girl.png",
                            RoleID = 1,
                        });
                    context.SaveChanges();
                }

                //if (!context.Subjects.Any()) {
                //    var core = context.Users.Where(i => i.RoleID == 1).FirstOrDefault();
                //    context.Subjects.AddRange(
                //        new Subject {
                //            CreatorUUID = core.UUID,
                //            Name = "Post",
                //            Description = "The main subject for pusts published."
                //        },
                //        new Subject {
                //            CreatorUUID = core.UUID,
                //            Name = "Forum",
                //            Description = "The group subject for discussions."
                //        });
                //    context.SaveChanges();
                //}

            }
        }

    }
}
