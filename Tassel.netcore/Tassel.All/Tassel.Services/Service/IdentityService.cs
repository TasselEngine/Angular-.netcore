using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Tassel.Service.Utils.Extensionss;
using Tassel.Services.Contract;
using System.Linq.Expressions;
using Tassel.DomainModel.Models;

namespace Tassel.Services.Service {
    public class IdentityService : IIdentityService<JwtSecurityToken, TokenProviderOptions, User> {
        public JwtSecurityToken GenerateToken(User user, TokenProviderOptions options) {
            throw new NotImplementedException();
        }

        public IList<User> GetUsersListByFilter(Expression<Func<User, bool>> whereLambada) {
            throw new NotImplementedException();
        }

        public JwtSecurityToken TokenDecrypt(string cookie) {
            throw new NotImplementedException();
        }

        public (User, bool, string) TryLogin(string user, string psd) {
            throw new NotImplementedException();
        }

        public (User, bool, string) TryRegister(string user, string psd, Gender gender = Gender.Male, string avatar = null) {
            throw new NotImplementedException();
        }
    }
}
