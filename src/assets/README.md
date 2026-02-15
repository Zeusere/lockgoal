# Assets (src/assets)

Images used by the app. Paths in code are relative to this folder as `../../assets/` from `src/screens/onboarding/`.

## Onboarding story (9 steps) – imágenes con movimiento

Cada paso del onboarding puede llevar una imagen o **GIF** encima del texto:

- **Paso 1:** ya usa `clock_onboarding.png` (con animación sutil de “respiración”).
- **Pasos 2–9:** por defecto se reutiliza la misma imagen. Para **movimiento real por paso**, añade un GIF por paso y actualiza `OnboardingStory.tsx`:
  - `onboarding_step2.gif` … `onboarding_step9.gif`
  - En `SLIDE_IMAGES` sustituye el `require('../../assets/clock_onboarding.png')` del paso correspondiente por `require('../../assets/onboarding_stepN.gif')`.

Los **GIF se animan solos** en React Native. Si usas PNG/JPG, la app aplica una animación suave de escala (respiración). Recomendación: GIF de 3–10 s en bucle para cada paso.

## Step 2 onboarding (SetGoal)

Place these 4 images here so they appear as the full-screen background of step 2:

- **step2_1.png** – Step 2-1 (top quarter)
- **step2_2.png** – Step 2-2
- **step2_3.png** – Step 2-3
- **step2_4.png** – Step 2-4 (bottom quarter)

They will be stacked vertically, each using 1/4 of the screen height, full width. Same aspect or resolution per image works best.
