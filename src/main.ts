import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  
  // Dynamic CORS setup to handle localhost, development variations, and production domains
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173', // Common fallback if you use Vite/React
        'http://127.0.0.1:3000',
      ];

      // Add environment variable URL to the allowed origins if it exists
      if (process.env.FRONTEND_URL) {
        // Splitting by comma allows you to support multiple production URLs if needed
        const envOrigins = process.env.FRONTEND_URL.split(',').map((url) => url.trim());
        allowedOrigins.push(...envOrigins);
      }

      // Allow requests with no origin (like Postman, mobile clients, or server-to-server requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS Architecture'));
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('University Job Portal API')
    .setDescription('REST API for University Job Portal')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
