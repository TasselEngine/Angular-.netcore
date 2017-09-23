
/**    The feature of login and register are based on middleware.
             See code in "JwtAuthentication.middleware.cs".

            Login : [POST] -> /api/user/login
            Register : [POST] -> /api/user/register

            body : {
                        "user" : "exampleUserName",
                        "psd" : "123456"
                        }

            response: {
                              "status" : 0,
                              "message" : null,
                              "content": {
                                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtaWFvMTdnYW1lIiwianRpIjoiNzc0N2ExMTE3YjA0
                                                NDk5Y2EyOTRkYjY3MjIzNDg4NGYiLCJpYXQiOjE1MDYxNDU3OTUsImdlbmRlciI6WyJNYWxlIiwiTWFsZSJ
                                                dLCJ1dWlkIjoiNzc0N2ExMTE3YjA0NDk5Y2EyOTRkYjY3MjIzNDg4NGYiLCJ1X25hbWUiOiJtaWFvMTdnY
                                                W1lIiwicm9sZV9pZCI6IjMiLCJuYmYiOjE1MDYxNDU3OTQsImV4cCI6MTUwNjc1MDU5NCwiaXNzIjoiVG
                                                Fzc2VsX0lTUyIsImF1ZCI6IlRhc3NlbF9BVUROIn0.lWQxG16uwAOgf_rCoqEsPbk2SameTNWpu_Qn-j7mLX0",
                                "name": "miao17game",
                                "uuid": "7747a1117b04499ca294db672234884f",
                                "expires": 604800
                              }
                            }
         */

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

        [HttpGet("weibo_access")]
        public async Task<JsonResult> WeiboAccess(string code, string redirect_url) {
            var (result,succeed,error) = await this.identity.GetWeiboTokenByCodeAsync(code, redirect_url);
            var status = succeed ? JsonStatus.Succeed : JsonStatus.Error;
            return this.JsonFormat(succeed, status, error, (object)result);
        }
    }
}
