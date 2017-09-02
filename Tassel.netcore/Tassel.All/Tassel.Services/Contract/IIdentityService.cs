using Tassel.DomainModel.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Text;

namespace Tassel.Services.Contract {
    public interface IIdentityService<TToken, TOptions> {

        (User, bool, string) TryRegister(string user, string psd, Gender gender = Gender.Male, string avatar = null);

        (User, bool, string) TryLogin(string user, string psd);

        (bool, string) TryChangePassword(string uuid, string oldOne, string newOne);

        (bool, string) TryUpdateUser(
            string uuid,
            string email = null,
            string f_name = null,
            string g_name = null,
            string avatar = null,
            Gender? gender = default(Gender?),
            DateTime? birthDate = default(DateTime?));

        (bool, string) TryAppoint(string uuid);

        (bool, string) TryDismisse(string uuid);

        TToken GenerateToken(User user, TOptions options);

        int GetRoleIDByToken(TToken token);

        int GetRoleIDByToken(string token);

        string GetUUIDByToken(TToken token);

        string GetUUIDByToken(string token);

        long GetCreateUnixByToken(TToken token);

        long GetCreateUnixByToken(string token);

        long GetExpireUnixByToken(TToken token);

        long GetExpireUnixByToken(string token);

        TToken TokenDecrypt(string cookie);

        IList<User> GetUsersListByFilter(Expression<Func<User, bool>> whereLambada);

        (dynamic, int count) GetAbstUsersListByFilter(Expression<Func<User, bool>> whereLambada);

        (dynamic, int count) GetAbstUsersGroup();

        (dynamic, int count) GetAbstAdminsGroup();

        (dynamic, int count) GetAbstCoreGroup();

        dynamic GetUserDetailsByUUID(string uuid);

        dynamic GetUserDetailsByUserName(string name);

    }
}
