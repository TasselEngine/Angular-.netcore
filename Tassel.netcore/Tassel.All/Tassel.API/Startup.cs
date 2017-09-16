using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tassel.Service.Utils.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Tassel.Service.Utils.Extensionss;

namespace Tassel.Service {
    public class Startup {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.AddMvc();
            services.AddApplicationDbContext(Configuration);
            //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            //    .AddJwtBearer(options => {
            //        options.RequireHttpsMetadata = false;
            //        options.TokenValidationParameters = new TokenValidationParameters() {
            //            ValidateIssuerSigningKey = true,
            //            ValidateIssuer = true,
            //            ValidateAudience = true,
            //            ValidateLifetime = true,
            //            IssuerSigningKey = TokenDecoder.CreateKey(Configuration),
            //            ValidIssuer = TokenProviderEntry.Issuer,
            //            ValidAudience = TokenProviderEntry.Audience,
            //            ClockSkew = TimeSpan.Zero
            //        };
            //    });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options=> {
                options.IncludeErrorDetails = true;
                options.TokenValidationParameters = TokenDecoder.CreateParam(Configuration);
                options.RequireHttpsMetadata = false;
            });

            //services.AddAuthorization(options => {
            //    options.AddPolicy(PolicyRole.Core, policy => policy.RequireClaim(TokenClaimsKey.RoleID, "3"));
            //    options.AddPolicy(PolicyRole.Admin, policy => policy.RequireClaim(TokenClaimsKey.RoleID, "2", "3"));
            //    options.AddPolicy(PolicyRole.User, policy => policy.RequireClaim(TokenClaimsKey.RoleID, "1", "2", "3"));
            //});
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();

        }
    }
}
