#!/bin/sh
# 一键启动：沙箱重置后 node_modules 会丢失（只保留 git 跟踪的文件），
# 本脚本自动恢复依赖后再启动，免去每次手动 npm install。
#
# 用法：
#   sh start.sh          # 恢复依赖（如需）并启动 dev server
#   sh start.sh preview  # 恢复依赖（如需）并启动生产预览
#   sh start.sh check    # 恢复依赖（如需）并跑类型检查
#
# 恢复策略：
#   1. /data/user 下的缓存 tarball 存在且与 package-lock.json 匹配 → 离线解压（秒级）
#   2. 否则 → npm install（联网），并把新 node_modules 写入缓存供下次离线恢复
set -e
cd "$(dirname "$0")"

CACHE_DIR="/data/user/.deps-cache-micao"
CACHE_TAR="$CACHE_DIR/node_modules.tar.gz"
CACHE_HASH="$CACHE_DIR/lock.sha256"
LOCK_HASH=$(sha256sum package-lock.json | cut -d' ' -f1)

# vite 可执行且版本二进制存在才算依赖完整（防止半截恢复）
deps_ok() {
  [ -x node_modules/.bin/vite ] && [ -d node_modules/vite ]
}

cache_ok() {
  [ -f "$CACHE_TAR" ] && [ -f "$CACHE_HASH" ] && [ "$(cat "$CACHE_HASH")" = "$LOCK_HASH" ]
}

if ! deps_ok; then
  echo "[start] node_modules 缺失（沙箱重置），开始恢复..."
  if cache_ok; then
    echo "[start] 从持久缓存离线恢复（$CACHE_TAR）"
    tar xzf "$CACHE_TAR"
    echo "[start] 恢复完成（离线，未联网）"
  else
    echo "[start] 缓存不可用或依赖版本已变化，联网安装..."
    rm -rf node_modules
    npm install --no-audit --no-fund
    # 写缓存供下次重置离线恢复（后台执行不阻塞启动）
    (
      mkdir -p "$CACHE_DIR"
      tar czf "$CACHE_TAR.tmp" node_modules \
        && mv "$CACHE_TAR.tmp" "$CACHE_TAR" \
        && echo "$LOCK_HASH" > "$CACHE_HASH" \
        && echo "[start] 依赖缓存已更新到 $CACHE_TAR"
    ) &
  fi
fi

exec npm run "${1:-dev}"
