# Laboratorio 4 - Aplicación Web Serverless en AWS

Frontend estático para una aplicación CRUD sencilla de gestión de usuarios. La interfaz está preparada para publicarse en Amazon S3 Static Website Hosting y consumir una API REST serverless construida con API Gateway, AWS Lambda, Amazon DynamoDB, IAM y CloudWatch.

## Arquitectura utilizada

```text
Usuario -> Amazon S3 -> API Gateway -> AWS Lambda -> Amazon DynamoDB -> Amazon CloudWatch
```

## Servicios AWS utilizados

- Amazon S3: alojamiento del sitio web estático.
- API Gateway: exposición de endpoints REST.
- AWS Lambda: lógica backend en Node.js.
- Amazon DynamoDB: almacenamiento de usuarios.
- IAM: permisos entre servicios AWS.
- CloudWatch: monitoreo y logs de ejecución.

## Estructura de archivos

```text
plantilla-crud-bootstrap/
|-- css/
|   |-- styles.css
|-- js/
|   |-- app.js
|   |-- config.js
|-- index.html
|-- README.md
```

## Configuración de API_BASE_URL

Edite `js/config.js` y reemplace el valor temporal por la URL base del stage de API Gateway:

```javascript
const API_BASE_URL = "https://abc123.execute-api.us-east-1.amazonaws.com/prod";
```

No incluya credenciales, access keys, llaves privadas ni secretos en este repositorio.

## Cómo ejecutar localmente

Puede abrir `index.html` directamente en el navegador o usar Live Server desde Visual Studio Code. Para consumir la API real, asegúrese de configurar primero `API_BASE_URL`.

## Cómo publicar en Amazon S3

1. Cree un bucket en Amazon S3.
2. Habilite Static Website Hosting.
3. Configure `index.html` como documento de inicio.
4. Suba `index.html`, la carpeta `css/` y la carpeta `js/`.
5. Configure los permisos necesarios para servir el sitio público o use CloudFront si el laboratorio lo requiere.
6. Abra la URL del sitio estático generada por S3.

## Endpoints utilizados

```text
GET  {API_BASE_URL}/usuarios
POST {API_BASE_URL}/usuarios
```

El POST envia el siguiente JSON:

```json
{
  "nombre": "Luis Chay",
  "email": "luis@usac.edu.gt"
}
```

El GET puede responder con un arreglo directo:

```json
[
  {
    "id": "uuid",
    "nombre": "Luis Chay",
    "email": "luis@usac.edu.gt",
    "fechaCreacion": "2026-06-05T00:00:00.000Z"
  }
]
```

También puede responder con la propiedad `usuarios`:

```json
{
  "usuarios": [
    {
      "id": "uuid",
      "nombre": "Luis Chay",
      "email": "luis@usac.edu.gt",
      "fechaCreacion": "2026-06-05T00:00:00.000Z"
    }
  ]
}
```

## Nota sobre CORS

API Gateway y Lambda deben permitir CORS para el dominio del sitio publicado en S3. Durante pruebas locales también puede ser necesario permitir el origen usado por Live Server, por ejemplo `http://127.0.0.1:5500`.

## Evidencias sugeridas para el informe

- Sitio publicado en Amazon S3.
- API Gateway respondiendo correctamente.
- Lambda ejecutada al crear y listar usuarios.
- Tabla DynamoDB con registros creados desde el frontend.
- Logs disponibles en CloudWatch.
- Frontend consumiendo GET y POST desde la API REST.
