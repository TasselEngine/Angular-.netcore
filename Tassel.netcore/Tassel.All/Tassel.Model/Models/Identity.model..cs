﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.Text; 

namespace Tassel.DomainModel.Models {

    [Table("users")]
    public class User {

        [Key]
        [Column("uuid")]
        public string UUID { get; set; }

        [Column("role_id")]
        public int RoleID { get; set; } = 3;

        [Column("u_name")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Username shouldn't be empty.")]
        public string UserName { get; set; }

        [Column("psd")]
        [IgnoreDataMember]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Password shouldn't be empty.")]
        public string Password { get; set; }

        [Column("email")]
        [EmailAddress(ErrorMessage = "Please input the correct email address.")]
        public string Email { get; set; }

        [Column("f_name")]
        public string FamilyName { get; set; }

        [Column("g_name")]
        public string GivenName { get; set; }

        [Column("gender")]
        [EnumDataType(enumType: typeof(Gender), ErrorMessage = "Please choose the correct gender.")]
        public Gender? Gender { get; set; }

        [Column("birth_date")]
        [DataType(DataType.Date, ErrorMessage = "Please choose the correct date.")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? BirthDate { get; set; }

        [Column("c_time")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime CreateTime { get; set; } = DateTime.UtcNow;

        [Column("u_time")]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? UpdateTime { get; set; } 

        [Column("home_ip")]
        public string HomeIP { get; set; }

        [Column("avatar")]
        public string Avatar { get; set; }

    }

    [Table("roles")]
    public class Role {

        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ID { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("desc")]
        public string Description { get; set; }

    }

    public enum GuidType { N, D, B, P }

    public enum Gender { Male, Female }

    public static class IdentityProvider {

        public static User CreateUser(string username, string password, Gender gender, string avatar) {
            using (var md5 = MD5.Create()) {
                return new User {
                    UUID = CreateGuid(GuidType.N),
                    UserName = username,
                    Password = CreateMD5(password),
                    Gender = gender,
                    Avatar = avatar,
                    RoleID = 3,
                };
            }
        }

        public static User CreateUser(string username, string password)
            => CreateUser(username, password, Gender.Male, null);

        public static string CreateMD5(string input) {
            if (input == null)
                return null;
            using (var md5 = MD5.Create()) {
                return BitConverter
                    .ToString(md5.ComputeHash(Encoding.UTF8.GetBytes(input)))
                    .Replace("-", "")
                    .ToLower();
            }
        }

        public static string CreateGuid(GuidType type = GuidType.D)
            => Guid.NewGuid().ToString(
                type == GuidType.B ? "B" :
                type == GuidType.D ? "D" :
                type == GuidType.N ? "N" :
                "P");

    }

    [DataContract]
    public class ApplicationJsonParam {

        [DataMember(Name = "user")]
        public string UserName { get; set; }

        [DataMember(Name = "psd")]
        public string Password { get; set; }
    }

}
