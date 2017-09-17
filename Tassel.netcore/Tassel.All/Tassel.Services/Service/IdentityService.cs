using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Tassel.Service.Utils.Extensionss;
using Tassel.Services.Contract;
using System.Linq.Expressions;
using Tassel.DomainModel.Models;
using Wallace.Core.Helpers.Format;
using System.Security.Claims;
using System.Linq;
using Microsoft.AspNetCore.Hosting;

namespace Tassel.Services.Service {
    public class IdentityService : IIdentityService<JwtSecurityToken, TokenProviderOptions, User> {

        private APIDB db;
        private IHostingEnvironment env;

        public IdentityService(APIDB db, IHostingEnvironment env) {
            this.db = db;
            this.env = env;
        }

        public JwtSecurityToken GenerateToken(User user, TokenProviderOptions options) {
            return new JwtSecurityToken(
                 issuer: options.Issuer,
                 audience: options.Audience,
                 claims: new Claim[]{
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, user.UUID),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToUnix().ToString(), ClaimValueTypes.Integer64),
                    new Claim(JwtRegisteredClaimNames.Gender, user.Gender.ToString()),
                    new Claim(TokenClaimsKey.Gender,user.Gender.ToString()),
                    new Claim(TokenClaimsKey.UUID,user.UUID),
                    new Claim(TokenClaimsKey.UserName,user.UserName),
                    new Claim(TokenClaimsKey.RoleID,user.RoleID.ToString()),
                 },
                 notBefore: DateTime.UtcNow,
                 expires: DateTime.UtcNow.Add(options.Expiration),
                 signingCredentials: options.SigningCredentials);
        }

        public IList<User> GetUsersListByFilter(Expression<Func<User, bool>> whereLambada) {
            throw new NotImplementedException();
        }

        public JwtSecurityToken TokenDecrypt(string cookie) {
            var (tk, _) = new TokenDecoder(env).Decrypt(cookie);
            return tk;
        }

        public (User, bool, string) TryLogin(string user, string psd) {
            var usr = db.Set<User>().Where(i => i.UserName == user).FirstOrDefault();
            if (user == null)
                return (null, false, "user not found");
            if (usr.Password != IdentityProvider.CreateMD5(psd))
                return (null, false, "password is not correct");
            return (usr, true, null);
        }

        public (User, bool, string) TryRegister(string user, string psd, Gender gender = Gender.Male, string avatar = null) {
            var usrr = db.Set<User>().Where(i => i.UserName == user).FirstOrDefault();
            if (usrr != null)
                return (null, false, "user account is exist already");
            usrr = IdentityProvider.CreateUser(user, psd, gender, avatar);
            db.Add(usrr);
            if (db.SaveChanges() <= 0)
                return (null, false, "save user informations failed");
            return (usrr, true, null);
        }
    }
}
