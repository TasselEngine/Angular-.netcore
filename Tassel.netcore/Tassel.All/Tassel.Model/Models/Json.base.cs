using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Tassel.Model.Models { 

    [DataContract]
    public class JsonBase : Dictionary<string, object> {

        public JsonBase() {
            this.Status = JsonStatus.Error;
            this.Message = "";
            this.Content = null;
        }

        public JsonBase(string message) : base() => this.Message = message;

        [DataMember(Name = "status")]
        public JsonStatus Status {
            get => (JsonStatus)this["Status"];
            set => this["Status"] = value;
        }

        [DataMember(Name = "msg")]
        public string Message {
            get => this["Message"] as string;
            set => this["Message"] = value;
        }

        [DataMember(Name = "content")]
        public object Content {
            get => this["Content"];
            set => this["Content"] = value;
        }

    }

    public enum JsonStatus {
        Succeed = 0,
        LoginFailed = 1,
        RegisterFailed = 2,
        UserNotFound = 3,
        UserExist = 4,
        Error = 255
    }

}
