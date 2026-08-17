import { defineConfig } from 'vite'

// Carrega o plugin React dinamicamente porque o pacote é ESM-only
export default defineConfig(async () => {
  const { default: react } = await import('@vitejs/plugin-react')
  return {
    plugins: [react()],
  }
})
