using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Tassel.DomainModel.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Tassel.Service.Utils.Extensionss;
using Tassel.Services.Contract;
using Tassel.Model.Models;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using Wallace.Core.Helpers.Controllers;
using System.Text;
using Wallace.Core.Helpers.Format;

namespace Tassel.Service.Utils.Middlewares {

    public static class TokenProviderExtensions {
        public static IApplicationBuilder AddTasselTokenCreator(
            this IApplicationBuilder builder,
            TokenProviderOptions opts) => builder.UseMiddleware<TokenCreatorMiddleware>(Options.Create(opts));
    }

    enum ProviderType { Login, Register, Undefined }

    public class CustomJwtDataFormat : ISecureDataFormat<AuthenticationTicket> {

        private readonly string algorithm;
        private readonly TokenValidationParameters param;

        public CustomJwtDataFormat(TokenValidationParameters param, string algorithm = SecurityAlgorithms.HmacSha256) {
            this.algorithm = algorithm;
            this.param = param;
        }

        public AuthenticationTicket Unprotect(string protectedText) => Unprotect(protectedText, null);

        public AuthenticationTicket Unprotect(string protectedText, string purpose) => new TokenDecoder(param, algorithm).Unprotect(protectedText);

        public string Protect(AuthenticationTicket data) => throw new NotImplementedException();

        public string Protect(AuthenticationTicket data, string purpose) => throw new NotImplementedException();
    }

    public class TokenCreatorMiddleware {

        private readonly RequestDelegate skip;
        private readonly TokenProviderOptions opts;
        private IIdentityService<JwtSecurityToken, TokenProviderOptions, User> identity;
        private IServiceProvider serviceProvider;

        public TokenCreatorMiddleware(
            IServiceProvider serviceProvider, 
            RequestDelegate next, 
            IOptions<TokenProviderOptions> options) {
            this.serviceProvider = serviceProvider;
            skip = next;
            opts = options.Value;
        }

        public Task Invoke(HttpContext context) {

            var type =
                context.Request.Path.Equals(opts.RegisterPath, StringComparison.Ordinal) ? ProviderType.Register :
                context.Request.Path.Equals(opts.LoginPath, StringComparison.Ordinal) ? ProviderType.Login :
                ProviderType.Undefined;

            if (type == ProviderType.Undefined)
                return skip(context);
            if (!context.Request.Method.Equals("POST"))
                return skip(context);
            if (!context.Request.HasFormContentType && context.Request.ContentType != "application/json")
                return skip(context);

            return GenerateToken(context, new JsonBase(), type);
        }

        private async Task GenerateToken(HttpContext context, JsonBase model, ProviderType type) {

            var username = default(string);
            var password = default(string);

            if (context.Request.ContentType != "application/json") {
                username = context.Request.Form["user"];
                password = context.Request.Form["psd"];
            } else {
                var bts = new byte[context.Request.ContentLength.Value];
                await context.Request.Body.ReadAsync(bts, 0, bts.Length);
                var user = JsonHelper.FromJson<ApplicationJsonParam>(Encoding.UTF8.GetString(bts));
                username = user.UserName;
                password = user.Password;
            }

            context.Response.ContentType = "application/json";

            var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();
            using (var scope = scopeFactory.CreateScope()) {

                identity = scope.ServiceProvider.GetRequiredService<IIdentityService<JwtSecurityToken, TokenProviderOptions, User>>();

                var (user, error) = GetIdentity(username, password, type);
                if (error != null) {
                    model.Message = error;
                    model.Status = type == ProviderType.Register ? JsonStatus.RegisterFailed : JsonStatus.LoginFailed;
                    model.Content = new {
                        RedirectUrl = type == ProviderType.Register ? TokenProviderEntry.RegisterPath : TokenProviderEntry.LoginPath
                    };
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(model, new JsonSerializerSettings {
                        ContractResolver = new LowercaseContractResolver(),
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                        Formatting = Formatting.Indented
                    }));
                    return;
                }

                model.Status = JsonStatus.Succeed;
                model.Message = null;

                model.Content = new {
                    token = new JwtSecurityTokenHandler().WriteToken(identity.GenerateToken(user, opts)),
                    name = user.UserName,
                    expires = (int)opts.Expiration.TotalSeconds
                };

                await context.Response.WriteAsync(JsonConvert.SerializeObject(model, new JsonSerializerSettings {
                    ContractResolver = new LowercaseContractResolver(),
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    Formatting = Formatting.Indented
                }));

            }

        }

        private (User, string) GetIdentity(string username, string password, ProviderType type) {
            var (user, ok, error) =
                type == ProviderType.Register ? identity.TryRegister(username, password) :
                type == ProviderType.Login ? identity.TryLogin(username, password) :
                (null, false, "failed");
            if (ok)
                return (user, null);
            return (null, error);
        }

        public static long ToUnixEpochDate(DateTime date)
            => (long)Math.Round((date.ToUniversalTime() - new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero)).TotalSeconds);

    }
}
