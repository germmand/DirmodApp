using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DirmodAPI.Core.Services;
using DirmodAPI.Core.Settings;
using DirmodAPI.Core.Wrappers;
using DirmodAPI.Web.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DirmodAPI.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private readonly string AllowAllOriginsPolicy = "_AllowAllOriginsPolicy";

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.Configure<CambioTodaySettings>(Configuration.GetSection("CAMBIOTODAY"));
            services.AddHttpClient("cambio.today", c =>
            {
                c.BaseAddress = new Uri("https://api.cambio.today/v1/");
            });
            services.AddScoped<ICambioTodayService, CambioTodayService>();
            services.AddScoped<IHttpClientWrapper, HttpClientWrapper>();
            services.AddAutoMapper(typeof(Startup));
            services.AddCors(options =>
            {
                options.AddPolicy(AllowAllOriginsPolicy, builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                }); 
            });
        }
        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            } 
            else 
            {
                app.UseHttpsRedirection();
            }

            app.UseCors(AllowAllOriginsPolicy);

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
