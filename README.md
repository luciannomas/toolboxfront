# Toolbox Frontend

Aplicación web para visualizar y gestionar archivos CSV. Desarrollada con React y desplegada en Vercel.

## 🚀 Demo

Puedes ver la aplicación funcionando en: [https://toolboxfront.vercel.app/](https://toolboxfront.vercel.app/)

## ✨ Características

- Visualización de archivos CSV en formato tabla
- Filtrado por archivo específico
- Interfaz intuitiva y responsive
- Autenticación mediante API Key
- Integración con backend en Railway

## 🛠️ Tecnologías Utilizadas

- React
- Axios para peticiones HTTP
- Bootstrap para estilos
- Jest para testing

## 📦 Instalación Local

Si deseas ejecutar la aplicación en tu entorno local, sigue estos pasos:

1. Clona el repositorio del frontend:
```bash
git clone https://github.com/luciannomas/toolboxfront.git
```

2. Instala las dependencias:
```bash
cd toolboxfront
npm install
```

3. Inicia la aplicación en modo desarrollo:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Configuración

Para que la aplicación funcione correctamente, necesitas:

1. El backend desplegado (por defecto usa: `https://toolboxback-production.up.railway.app`)
2. Una API Key válida (por defecto usa: `aSuperSecretKey`)

## 📚 Backend

El backend de la aplicación está desplegado en Railway y su código fuente está disponible en:
- Repositorio: [https://github.com/luciannomas/toolboxback](https://github.com/luciannomas/toolboxback)
- API en producción: [https://toolboxback-production.up.railway.app](https://toolboxback-production.up.railway.app)

## 🧪 Testing

Para ejecutar los tests:
```bash
npm test
```

## 📝 Notas Adicionales

- La aplicación está configurada para trabajar con el backend en Railway
- Los archivos CSV deben seguir un formato específico para ser procesados correctamente
- Se requiere una API Key válida para acceder a los endpoints

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
