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
using System.Threading.Tasks;
using System.Net.Http;
using System.Diagnostics;
using System.IO;
using Newtonsoft.Json;
using Tassel.Model.Models;

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

        public (User, bool, string) GetUserDetailsByID(string uuid) {
            var usr = db.Users.Where(i => i.UUID == uuid).FirstOrDefault();
            if (usr == null)
                return (null, false, "user not found");
            return (usr, true, null);
        }

        public IEnumerable<dynamic> GetUsersListByFilter(Expression<Func<User, bool>> whereLambada) {
            return this.db.Users.Where(whereLambada).Select(i => new {
                UUID = i.UUID,
                UserName = i.UserName,
                Gender = i.Gender,
                RoleID = i.RoleID
            });
        }

        public JwtSecurityToken TokenDecrypt(string cookie) {
            var (tk, _) = new TokenDecoder(env).Decrypt(cookie);
            return tk;
        }

        public (User, bool, string) TryLogin(string user, string psd) {
            var usr = db.Users.Where(i => i.UserName == user).FirstOrDefault();
            if (usr == null)
                return (null, false, "user not found");
            if (usr.Password != IdentityProvider.CreateMD5(psd))
                return (null, false, "password is not correct");
            return (usr, true, null);
        }

        public (User, bool, string) TryRegister(string user, string psd, Gender gender = Gender.Male, string avatar = null) {
            var usrr = db.Users.Where(i => i.UserName == user).FirstOrDefault();
            if (usrr != null)
                return (null, false, "user account is exist already");
            usrr = IdentityProvider.CreateUser(user, psd, gender, avatar);
            db.Add(usrr);
            if (db.SaveChanges() <= 0)
                return (null, false, "save user informations failed");
            return (usrr, true, null);
        }

        public async Task<(dynamic, bool, string)> GetWeiboTokenByCodeAsync(string code, string redirect_url) {
            var oars = "client_id=185930524&client_secret=389e2d039b372cf2763c4842ea1c46d1&grant_type=authorization_code";
            HttpContent hc = new StringContent(oars, Encoding.UTF8, "application/x-www-form-urlencoded");
            using (var client = new HttpClient()) {
                try {
                    var result = await client.PostAsync($"https://api.weibo.com/oauth2/access_token?code={code}&redirect_uri={redirect_url}", hc);
                    var conStr = await result.Content.ReadAsStringAsync();
                    try {
                        var succ_token = JsonHelper.FromJson<WeiboSuccessToken>(conStr);
                        return succ_token == null || succ_token.AccessToken == null ?
                            ((object)JsonHelper.FromJson<WeiboErrorToken>(conStr), false, "invalid authentication."):
                            (succ_token, true, null);
                    } catch {
                        return (null, false, "try read weibo access token from response failed.");
                    }
                } catch(Exception ex) {
                    Debug.WriteLine($"error throws : {ex.StackTrace}");
                    return (null,false,"get weibo access token failed.");
                }
            }
        }
    }
}
