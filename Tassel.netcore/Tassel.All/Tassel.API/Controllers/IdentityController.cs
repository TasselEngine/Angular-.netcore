using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Wallace.Core.Helpers.Controllers;
using Tassel.Model.Models;
using Tassel.Service.Utils.Extensionss;
using Tassel.DomainModel.Models;
using Tassel.Services.Contract;
using System.IdentityModel.Tokens.Jwt;
using Tassel.API.Utils.Authorization;

namespace Tassel.Service.Controllers {
    [Route("api/user")]
    public class IdentityController : Controller {

        private APIDB db;
        private IIdentityService<JwtSecurityToken, TokenProviderOptions, User> identity;

        public IdentityController(APIDB db, IIdentityService<JwtSecurityToken, TokenProviderOptions, User> isrv) {
            this.db = db;
            this.identity = isrv;
        }

        [HttpGet]
        [AdminAuthorize]
        public JsonResult GetAll() {
            return this.JsonFormat(new JsonBase {
                Status = JsonStatus.Succeed,
                Message = "success",
                Content = this.identity.GetUsersListByFilter(i=>true)
            });
        }

        [HttpGet("{id}")]
        [UserAuthorize]
        public JsonResult GetUser(string id) {
            var (user, succeed, error) = this.identity.GetUserDetailsByID(id);
            return this.JsonFormat(new JsonBase {
                Status = succeed?JsonStatus.Succeed:JsonStatus.UserNotFound,
                Message = succeed?"success":error,
                Content = user
            });
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value) {
        }

        [HttpDelete("{id}")]
        public void Delete(int id) {
        }
    }
}
