# **Challenge Backend – Interbanking**

## **Precondiciones**
- **Node.js v20 o mayor**
---

## **Instalación y ejecución**

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Levantar el servidor en modo desarrollo**
   ```bash
   npm run start:dev
   ```
   El proyecto se levantará en:  
   ```
   http://localhost:3000
   ```

3. **Probar los endpoints**
   - En la carpeta del proyecto encontrarás una colección de **Postman** para probar los EPs solicitados, para utilizar esto simplemente dirijanse a Postman y coloquen importar, arrastren o seleccionen el archivo y con eso ya van a poder ver la colección.
   - Se incluyen **datos de prueba**:
     - **Transferencias**: mockeadas.
     - **Compañías**: se crearon registros para que el primer `GET` no devuelva vacío.

4. **Ejecutar tests unitarios**
   ```bash
   npm run test
   ```
   Esto ejecutará los tests de `services`, `controllers` y `repositories`.

---

## ** Estructura del proyecto**
```
src/
 ├── companies/       # Módulo de compañías
 ├── transfers/       # Módulo de transferencias
 ├── database/        # Persistencia en JSON
 ├── main.ts          # Bootstrap + seguridad
 └── app.module.ts
```

---

## **Seguridad**
- **helmet**: protección HTTP básica.
- **ValidationPipe** global:
  - **whitelist**: solo acepta propiedades definidas en DTOs.
  - **forbidNonWhitelisted**: lanza error si llegan props extra.
  - **transform**: convierte tipos automáticamente.

---

## ** Endpoints principales**
### **Empresas**
- `GET /companies` → Listar todas las empresas
- `GET /companies/joined-last-month` → Empresas que se adhirieron el último mes
- `GET /companies/transferred-last-month` → Empresas con transferencias el último mes
- `POST /companies` → Crear una nueva empresa

**Ejemplo de creación**
```json
{
  "cuit": "30700000001",
  "razonSocial": "Empresa Ejemplo SRL",
  "tipo": "PYME",
  "fechaAdhesion": "2024-08-08"
}
```

---

### **Transferencias**
- `GET /transfers` → Listar todas las transferencias
- `POST /transfers` → Crear una nueva transferencia

**Ejemplo de creación**
```json
{
  "empresaId": "1a2b3c4d",
  "importe": 15000,
  "cuentaDebito": "0000000000000000000001",
  "cuentaCredito": "0000000000000000000002"
}
```

---

## **☁ Lambda – Integración opcional**
### 1️⃣ Exponer la Lambda vía API Gateway
- Crear en AWS un **API Gateway REST API**.
- Configurar ruta `POST /register-company` que invoque la Lambda.
- API Gateway entregará una URL como:
  ```
  https://abc123.execute-api.aws/dev/register-company
  ```

### 2️⃣ Integración en NestJS
En `CompaniesService.create`:
```ts
import axios from 'axios';

async create(dto: CreateCompanyDto) {
  const response = await axios.post(
    'https://abc123.aws/dev/register-company',
    dto
  );
  return response.data;
}
```

### 3️⃣ Ejemplo de entrada
```json
{
  "cuit": "30700000004",
  "razonSocial": "Empresa Lambda SRL",
  "tipo": "PYME"
}
```

### 4️⃣ Ejemplo de salida exitosa
```json
{
  "message": "Empresa registrada con éxito",
  "company": {
    "id": "1733819200000",
    "cuit": "30700000004",
    "razonSocial": "Empresa Lambda SRL",
    "tipo": "PYME",
    "fechaAdhesion": "2025-08-09T14:30:00.000Z"
  }
}
```

### 5️⃣ Ejemplo de error
```json
{
  "error": "Ya existe una empresa con el CUIT 30700000004"
}
```

**Referencia**: Imagen de flujo en `lambda/lambda_flujo.png`.

---

## **Testing y cobertura**
- Tests unitarios para:
  - `CompaniesService`
  - `TransfersService`
  - `CompaniesController`
  - `TransfersController`
  - `JsonRepository`
- Cobertura alta en lógica y controladores.
- Ejecutar con:
  ```bash
  npm run test -- --coverage
  ```

---

##
- [x] `npm install` sin errores de compatibilidad
- [x] Endpoints implementados según requerimientos
- [x] Validaciones con `class-validator` y `ValidationPipe`
- [x] Seguridad HTTP con `helmet`
- [x] Fechas UTC para evitar problemas de zona horaria
- [x] Tests unitarios que pasan correctamente
- [x] Mock de datos para pruebas rápidas
