#!/bin/sh
# 一键启动：沙箱重置后 node_modules 会丢失（只保留 git 跟踪的文件），
# 本脚本自动恢复依赖后再启动，免去每次手动 npm install。
#
# 用法：
#   sh start.sh          # 恢复依赖（如需）并启动 dev server
#   sh start.sh preview  # 恢复依赖（如需）并启动生产预览
#   sh start.sh check    # 恢复依赖（如需）并跑类型检查
#
# 恢复策略（三层）：
#   1. /data/user 下的缓存 tarball 存在且与 package-lock.json 匹配
#      → 离线解压（约 2 秒，不联网）
#   2. 无 tarball 但 npm 缓存命中（同样持久化在 /data/user）
#      → npm install --prefer-offline（本地缓存包，不走网络下载）
#   3. 全部未命中 → npm install（联网），完成后【同步】写入 tarball 缓存
#
# 注意：缓存写入必须同步（阻塞）执行。曾用后台 & 方式写缓存，结果
# 进程/沙箱重置时后台 tar 被杀，只留下 .tmp 半截文件，缓存永远
# 无法命中。实测整包压缩仅 ~7 秒，同步写入完全可接受。
set -e
cd "$(dirname "$0")"

CACHE_DIR="/data/user/.deps-cache-micao"
CACHE_TAR="$CACHE_DIR/node_modules.tar.gz"
CACHE_HASH="$CACHE_DIR/lock.sha256"
NPM_CACHE="/data/user/.npm-cache-micao"
LOCK_HASH=$(sha256sum package-lock.json | cut -d' ' -f1)

# vite 可执行且版本二进制存在才算依赖完整（防止半截恢复）
deps_ok() {
  [ -x node_modules/.bin/vite ] && [ -d node_modules/vite ]
}

cache_ok() {
  [ -f "$CACHE_TAR" ] && [ -f "$CACHE_HASH" ] && [ "$(cat "$CACHE_HASH")" = "$LOCK_HASH" ]
}

# 同步写入 tarball 缓存（原子：tmp → mv → 写哈希，哈希最后写作为完成标记）
write_cache() {
  rm -f "$CACHE_TAR.tmp"
  mkdir -p "$CACHE_DIR"
  echo "[start] 写入依赖缓存（同步，约 7 秒，只需一次）..."
  tar czf "$CACHE_TAR.tmp" node_modules
  mv "$CACHE_TAR.tmp" "$CACHE_TAR"
  echo "$LOCK_HASH" > "$CACHE_HASH"
  echo "[start] 缓存已写入 $CACHE_TAR（下次重置可离线秒级恢复）"
}

if ! deps_ok; then
  echo "[start] node_modules 缺失（沙箱重置），开始恢复..."
  # 清理上次可能被中断的半截缓存
  [ -f "$CACHE_TAR.tmp" ] && rm -f "$CACHE_TAR.tmp" && echo "[start] 已清理中断的缓存残留"
  if cache_ok; then
    echo "[start] 命中 tarball 缓存，离线恢复..."
    tar xzf "$CACHE_TAR"
    echo "[start] 离线恢复完成（未联网）"
  else
    if [ -d "$NPM_CACHE" ] && [ "$(ls -A "$NPM_CACHE" 2>/dev/null | head -1)" ]; then
      echo "[start] tarball 缓存未命中，使用持久 npm 缓存离线安装..."
      rm -rf node_modules
      npm install --no-audit --no-fund --prefer-offline --cache "$NPM_CACHE"
    else
      echo "[start] 缓存均未命中，联网安装（并建立持久缓存）..."
      rm -rf node_modules
      npm install --no-audit --no-fund --cache "$NPM_CACHE"
    fi
    # 同步写缓存：保证本次一定生成完整 tarball，后续重置可离线恢复
    write_cache
  fi
fi

exec npm run "${1:-dev}"
