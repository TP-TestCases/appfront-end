import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@domain': resolve('src/renderer/src/domain'),
        '@application': resolve('src/renderer/src/application'),
        '@infrastructure': resolve('src/renderer/src/infrastructure'),
        '@presentation': resolve('src/renderer/src/presentation')
      }
    },
    plugins: [react()]
  }
})
