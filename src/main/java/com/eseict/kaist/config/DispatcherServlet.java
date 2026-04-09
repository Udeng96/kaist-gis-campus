package com.eseict.kaist.config;


import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.*;

@Component
@EnableAsync
@ComponentScan(basePackages = "com.eseict")
class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        WebMvcConfigurer.super.addCorsMappings(registry);

        registry.addMapping("/**") // cors를 적용할 url 패턴
                .allowedOrigins("*") // 모든 origin 허락
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("Authorization", "*")
                .exposedHeaders("Custom-Header") // 클라이언트 측 응답에서 노출되는 헤더
                .allowCredentials(false)  // credencial 포함할 수 있는지
                .maxAge(3600); // 해당 시간만큼 pre-flight 리퀘스트 캐싱 가능
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        WebMvcConfigurer.super.addInterceptors(registry);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/gis/assets/**")
                .addResourceLocations("classpath:/static/assets/")
                .resourceChain(true);

        // vite.svg 로고
        registry.addResourceHandler("/gis/vite.svg")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true);
        registry.addResourceHandler("/**").addResourceLocations("classpath:/META-INF/resources/");
    }
}

