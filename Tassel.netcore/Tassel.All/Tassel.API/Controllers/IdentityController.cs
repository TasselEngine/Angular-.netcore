using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Wallace.Core.Helpers.Controllers;
using Tassel.Model.Models;
using Microsoft.AspNetCore.Authorization;
using Tassel.Service.Utils.Extensionss;
using Tassel.DomainModel.Models;
using Tassel.Services.Contract;
using System.IdentityModel.Tokens.Jwt;

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
        public JsonResult Get() {
            return this.JsonFormat(new JsonBase {
                Status = JsonStatus.Succeed,
                Message = "success",
                Content = null,
            });
        }

        [HttpGet("{id}")]
        //[Authorize(Policy = PolicyRole.Core)]
        //[Authorize("Bearer")]
        [Authorize]
        public string Get(int id) {
            return "12345678";
        }

        //[HttpPost]
        //[Route("register")]
        //public void Register(int id, [FromForm]string value) {
        //}

        //[HttpPost]
        //[Route("login")]
        //public void Login(int id, [FromForm]string value) {
        //}

        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value) {
        }

        [HttpDelete("{id}")]
        public void Delete(int id) {
        }
    }
}
