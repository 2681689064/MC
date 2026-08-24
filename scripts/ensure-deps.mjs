// 依赖完整性检测脚本
// 在 vite 启动前自动检测 node_modules 是否完整，损坏则自动重装
// 解决沙盒工作区重置导致 node_modules 被清理的问题
import { existsSync, statSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'

const root = process.cwd()

const CRITICAL_DEPS = [
  'node_modules/.bin/vite',
  'node_modules/vite/bin/vite.js',
  'node_modules/react/package.json',
  'node_modules/react-dom/package.json',
  'node_modules/react-leaflet/package.json',
  'node_modules/leaflet/package.json',
  'node_modules/react-router-dom/package.json',
  'node_modules/@vitejs/plugin-react/package.json',
  'node_modules/tailwindcss/package.json',
  'node_modules/typescript/package.json',
]

function isBroken() {
  for (const dep of CRITICAL_DEPS) {
    const p = resolve(root, dep)
    if (!existsSync(p)) {
      console.log(`[ensure-deps] 缺失: ${dep}`)
      return true
    }
  }
  try {
    const stat = statSync(resolve(root, 'node_modules'))
    if (!stat.isDirectory()) return true
  } catch {
    return true
  }
  return false
}

if (isBroken()) {
  console.log('[ensure-deps] node_modules 不完整，正在自动重新安装依赖...')
  try {
    execSync('npm install --no-audit --no-fund', { stdio: 'inherit', cwd: root })
    console.log('[ensure-deps] 依赖安装完成')
  } catch (err) {
    console.error('[ensure-deps] 依赖安装失败:', err.message)
    process.exit(1)
  }
} else {
  console.log('[ensure-deps] node_modules 完整，跳过安装')
}
