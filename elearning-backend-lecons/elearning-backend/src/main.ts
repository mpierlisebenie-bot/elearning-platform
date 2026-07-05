import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale (class-validator)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // CORS pour le frontend React
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Documentation Swagger — http://localhost:3001/api/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('StudyLearn API')
    .setDescription(
      'API REST de la plateforme e-learning StudyLearn — NestJS · TypeORM · MySQL · JWT · RBAC.\n\n' +
        'Rôles : user (apprenant), instructor (formateur), admin (administrateur).\n' +
        'API externe intégrée : Open-Meteo (GET /weather).',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
  console.log(`📖 Documentation Swagger : http://localhost:${port}/api/docs`);
}
bootstrap();
