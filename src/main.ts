// Importa NestFactory del núcleo de NestJS para poder crear la instancia de la aplicación Nest.
import { NestFactory } from '@nestjs/core';
// Importa AppModule, el módulo raíz de la aplicación que organiza y conecta todos los controladores y proveedores.
import { AppModule } from './app.module';
// Importa ConfigService del módulo de configuración de NestJS para acceder a las variables de entorno del sistema o del archivo .env.
import { ConfigService } from '@nestjs/config';

// Define la función asíncrona 'bootstrap' que inicializa y arranca la aplicación NestJS.
async function bootstrap() {
  // Crea la instancia de la aplicación NestJS utilizando el módulo raíz AppModule como punto de entrada.
  const app = await NestFactory.create(AppModule);
  // Obtiene el servicio ConfigService desde la instancia del contenedor de inyección de dependencias de la aplicación.
  const configService = app.get(ConfigService);
  // Recupera el puerto de la variable de entorno 'PORT' usando configService, o usa 3000 por defecto si no está definido.
  const port = configService.get<number>('PORT', 3000);
  
  // Inicia la escucha del servidor HTTP en el puerto obtenido para comenzar a recibir peticiones de clientes.
  await app.listen(port);
  // Imprime un mensaje en la consola indicando que el servidor se ha iniciado correctamente y la dirección URL local correspondiente.
  console.log(`Application is running on: http://localhost:${port}`);
}
// Invoca la función bootstrap para ejecutar todo el proceso de inicio de la aplicación.
bootstrap();

