# Página de Status - Mark3

## Descripción

La página de status es una herramienta de monitoreo que verifica automáticamente el estado de todas las variables de entorno y conexiones necesarias para el funcionamiento de la aplicación Mark3.

## Acceso

Puedes acceder a la página de status navegando a:
```
http://localhost:3000/status
```

O usando el enlace "Status" en la barra de navegación de la aplicación.

## Funcionalidades

### 1. Verificación de Variables de Entorno

La página verifica las siguientes variables de entorno:

- **OPENAI_API_KEY**: Clave de API de OpenAI para el chat AI
- **NEXT_PUBLIC_PINATA_JWT**: Token JWT de Pinata para almacenamiento IPFS
- **NEXT_PUBLIC_STORY_NETWORK**: Red de Story Protocol (aeneid/mainnet)
- **NEXT_PUBLIC_RPC_PROVIDER_URL**: URL personalizada del RPC (opcional)
- **NODE_ENV**: Entorno de ejecución

### 2. Verificación de Conexiones

Realiza pruebas de conectividad con:

- **OpenAI API**: Verifica que la API key sea válida y funcional
- **Pinata API**: Prueba la autenticación y conectividad con Pinata
- **Story Protocol RPC**: Verifica la conexión con la red blockchain

### 3. Verificación de Servicios

Comprueba el estado de:

- **Servidor Next.js**: Confirma que el servidor esté funcionando
- **Story Protocol SDK**: Verifica que el SDK esté disponible
- **OpenAI SDK**: Confirma que el SDK esté instalado
- **Configuración de red**: Muestra la configuración actual de Story Protocol

## Estados de Verificación

### ✅ Success (Verde)
- Variable configurada correctamente
- Conexión exitosa
- Servicio funcionando

### ❌ Error (Rojo)
- Variable no configurada
- Error de conexión
- Servicio no disponible

### ⏳ Loading (Amarillo)
- Verificación en progreso

## Configuración Requerida

Para que todos los servicios funcionen correctamente, asegúrate de tener configuradas las siguientes variables en tu archivo `.env`:

```env
# OpenAI API Key
OPENAI_API_KEY=tu_api_key_de_openai

# Pinata JWT Token
NEXT_PUBLIC_PINATA_JWT=tu_jwt_de_pinata

# Story Protocol Network (opcional - por defecto: aeneid)
NEXT_PUBLIC_STORY_NETWORK=aeneid

# RPC Provider URL (opcional)
# NEXT_PUBLIC_RPC_PROVIDER_URL=https://tu-rpc-personalizado.com

# Environment
NODE_ENV=development
```

## Obtención de Credenciales

### OpenAI API Key
1. Ve a [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crea una nueva API key
3. Copia la key y agrégala a tu archivo `.env`

### Pinata JWT
1. Ve a [Pinata Developers](https://app.pinata.cloud/developers/api-keys)
2. Crea una nueva API key
3. Copia el JWT token y agrégalo a tu archivo `.env`

## Uso

1. **Accede a la página**: Navega a `/status` en tu aplicación
2. **Revisa el estado**: La página se actualiza automáticamente al cargar
3. **Actualiza manualmente**: Usa el botón "Actualizar Estado" para verificar nuevamente
4. **Soluciona problemas**: Revisa los errores mostrados y configura las variables faltantes

## Solución de Problemas

### Error: "OPENAI_API_KEY no está configurada"
- Verifica que tengas un archivo `.env` en la raíz del proyecto
- Asegúrate de que la variable `OPENAI_API_KEY` esté definida
- Reinicia el servidor después de agregar variables de entorno

### Error: "Conexión OpenAI - Error de conexión"
- Verifica que tu API key sea válida
- Confirma que tengas saldo en tu cuenta de OpenAI
- Revisa que no haya problemas de red

### Error: "Conexión Pinata - Error de autenticación"
- Verifica que tu JWT token sea válido
- Confirma que tu cuenta de Pinata esté activa
- Revisa que el token no haya expirado

### Error: "Conexión Story Protocol RPC - Error de conexión"
- Verifica tu conexión a internet
- Confirma que la red configurada esté disponible
- Revisa si hay problemas con el RPC de Story Protocol

## API Endpoint

La página utiliza el endpoint `/api/status` que devuelve un JSON con el estado de todos los servicios:

```json
{
  "environment": [
    {
      "name": "OpenAI API Key",
      "status": "success",
      "message": "Configurada correctamente",
      "details": "Key: sk-123456..."
    }
  ],
  "connections": [
    {
      "name": "Conexión OpenAI",
      "status": "success",
      "message": "Conexión exitosa",
      "details": "API de OpenAI responde correctamente"
    }
  ],
  "services": [
    {
      "name": "Servidor Next.js",
      "status": "success",
      "message": "Funcionando correctamente",
      "details": "El servidor está respondiendo a las peticiones"
    }
  ]
}
```

## Notas Técnicas

- La página se actualiza automáticamente al cargar
- Las verificaciones de conexión tienen un timeout de 10 segundos
- Los errores se muestran con detalles para facilitar la solución
- La página es responsive y funciona en dispositivos móviles
- El estado se actualiza en tiempo real sin recargar la página 