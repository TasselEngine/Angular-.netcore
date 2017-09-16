using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Wallace.Core.Helpers.Controllers;
using Tassel.Model.Models;
using Microsoft.AspNetCore.Authorization;
using Tassel.Service.Utils.Extensionss;

namespace Tassel.Service.Controllers {
    [Route("api/user")]
    public class IdentityController : Controller {
        // GET api/values
        [HttpGet]
        public JsonResult Get() {
            return this.JsonFormat(new JsonBase {
                Status=0,
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

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value) {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value) {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id) {
        }
    }
}
