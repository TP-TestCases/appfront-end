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
        '@auth': resolve('src/renderer/src/auth'),
        '@chat': resolve('src/renderer/src/chat'),
        '@dashboard': resolve('src/renderer/src/dashboard'),
        '@epics': resolve('src/renderer/src/epics'),
        '@projects': resolve('src/renderer/src/projects'),
        '@settings': resolve('src/renderer/src/settings'),
        '@userstories': resolve('src/renderer/src/userstories'),
        '@shared': resolve('src/renderer/src/shared'),
      }
    },
    plugins: [react()]
  }
})
