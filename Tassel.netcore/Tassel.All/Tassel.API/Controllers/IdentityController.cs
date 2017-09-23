using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Tassel.API.Utils.Extensions;
using Wallace.Core.Helpers.Controllers;
using Tassel.Model.Models;
using Tassel.Service.Utils.Extensionss;
using Tassel.DomainModel.Models;
using Tassel.Services.Contract;
using System.IdentityModel.Tokens.Jwt;
using Tassel.API.Utils.Authorization;
using Tassel.API.VM.Identity;

namespace Tassel.Service.Controllers {
    [Route("api/user")]
    public class IdentityController : Controller {

        private APIDB db;
        private IIdentityService<JwtSecurityToken, TokenProviderOptions, User> identity;

        public IdentityController(APIDB db, IIdentityService<JwtSecurityToken, TokenProviderOptions, User> isrv) {
            this.db = db;
            this.identity = isrv;
        }

        /**    The feature of login and register are based on middleware.
                 See code in "JwtAuthentication.middleware.cs".

                Login : [POST] -> /api/user/login
                Register : [POST] -> /api/user/register

                body : {
                            "user" : "exampleUserName",
                            "psd" : "123456"
                            }

                response: {
                                "token" : "HVSJVISVBEHSVS777SBVSEVB=SEUVGEV@#@fsdV9S......",
                                "name" : "exampleUserName",
                                "uuid" : "dsjvev7v8see3cb8vefc23c8vve",
                                "expires" : 50000000
                                }
             */

        [HttpGet]
        [AdminAuthorize]
        public JsonResult GetAll() {
            return this.JsonFormat(true, content: this.identity.GetUsersListByFilter(i => true));
        }

        [HttpGet("{id}")]
        [UserAuthorize]
        public JsonResult GetUser(string id) {
            var (user, succeed, error) = this.identity.GetUserDetailsByID(id);
            var status = succeed ? JsonStatus.Succeed : JsonStatus.UserNotFound;
            return this.JsonFormat(succeed, status, error, user);
        }

        [HttpPut("{id}")]
        public void Put(string id, [FromBody]UpdateUser user) {
        }

        /// <summary>
        /// It's unavaliable to delete an user.
        /// </summary>
        /// <param name="id"></param>
        [HttpDelete("{id}")]
        public JsonResult Delete(string id) {
            return this.JsonFormat(false, error: "deleting user is unavaliable.");
        }
    }
}
