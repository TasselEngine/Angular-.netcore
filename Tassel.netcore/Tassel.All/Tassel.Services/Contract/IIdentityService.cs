using Tassel.DomainModel.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Text;

namespace Tassel.Services.Contract {
    public interface IIdentityService<TToken, TOptions, TUser> {

        (TUser, bool, string) TryRegister(string user, string psd, Gender gender = Gender.Male, string avatar = null);

        (TUser, bool, string) TryLogin(string user, string psd);

        TToken GenerateToken(TUser user, TOptions options);

        TToken TokenDecrypt(string cookie);

        IList<TUser> GetUsersListByFilter(Expression<Func<TUser, bool>> whereLambada);

    }
}
