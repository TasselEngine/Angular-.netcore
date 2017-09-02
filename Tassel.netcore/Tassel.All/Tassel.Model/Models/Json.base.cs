using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Tassel.Model.Models

    [DataContract]
    public class JsonBase : Dictionary<string, object> {

        public JsonBase() {
            this["status"] = 500;
            this["count"] = 0;
        }

        public JsonBase(string message) : base() => this.Message = message;

        [DataMember(Name = "status")]
        public int Status {
            get => (int)this["status"];
            set => this["status"] = value;
        }

        [DataMember(Name = "msg")]
        public string Message {
            get => this["msg"] as string;
            set => this["msg"] = value;
        }

        [DataMember(Name = "redirect_url")]
        public string RedirectUrl {
            get => this["redirect_path"] as string;
            set => this["redirect_path"] = value;
        }

        [DataMember(Name = "content")]
        public object Content {
            get => this["content"];
            set => this["content"] = value;
        }

        [DataMember(Name = "count")]
        public new int Count {
            get => (int)this["count"];
            set => this["count"] = value;
        }

    }

}
