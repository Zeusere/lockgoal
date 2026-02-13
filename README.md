# LockGoal

App de productividad para iOS/Android: define objetivos diarios y bloquea apps distractoras hasta cumplirlos.

## Ver la app con Expo Go

1. **Instala Expo Go** en tu móvil:
   - [iOS – App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android – Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **En la carpeta del proyecto**, arranca el servidor de desarrollo:

   ```bash
   npm start
   ```

   (o `npx expo start`)

3. **Escanea el código QR**:
   - **iOS**: abre la cámara y escanea el QR que sale en la terminal.
   - **Android**: abre la app **Expo Go** y escanea el QR desde ahí.

4. Si el móvil y el PC no están en la misma red WiFi, inicia con túnel:

   ```bash
   npx expo start --tunnel
   ```

## Scripts

| Comando        | Descripción                    |
|----------------|--------------------------------|
| `npm start`    | Inicia Expo (Metro)            |
| `npm run ios` | Abre en simulador iOS (Mac)    |
| `npm run android` | Abre en emulador Android  |
| `npm run web` | Abre en el navegador           |
| `npm run lint`| Ejecuta ESLint                 |

## Estructura

- `src/screens/` – Pantallas (onboarding, Today, Capture, Settings)
- `src/components/` – Componentes reutilizables
- `src/navigation/` – Navegación (React Navigation)
- `src/store/` – Estado global (Zustand)
- `src/theme/` – Colores y tipografía

## Nota sobre bloqueo de apps

El bloqueo real de apps (Screen Time API) solo funciona en una **build nativa** de iOS (Xcode). En **Expo Go** la app usa un mock: la UI y el flujo funcionan, pero no se bloquean apps en el dispositivo.
