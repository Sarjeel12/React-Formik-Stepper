import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/React-Formik-Stepper/",

})

// export default defineConfig({
//   plugins: [react()],
//   base: "/React-Formik-Stepper/",   // ⚠️ IMPORTANT (repo name)
// });