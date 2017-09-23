using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Tassel.Model.Models {
    [DataContract]
    public class WeiboErrorToken {
        [DataMember(Name = "error")]
        public string Error { get; set; }

        [DataMember(Name = "error_code")]
        public int ErrorCode { get; set; }

        [DataMember(Name = "request")]
        public string Request { get; set; }

        [DataMember(Name = "error_uri")]
        public string ErrorUri { get; set; }

        [DataMember(Name = "error_description")]
        public string ErrorDescription { get; set; }
    }

    [DataContract]
    public class WeiboSuccessToken {
        [DataMember(Name = "access_token")]
        public string AccessToken { get; set; }

        [DataMember(Name = "remind_in")]
        public string RemindIn { get; set; }

        [DataMember(Name = "expires_in")]
        public int ExpiresIn { get; set; }

        [DataMember(Name = "uid")]
        public string Uid { get; set; }

        [DataMember(Name = "isRealName")]
        public bool IsRealName { get; set; }
    }

}
