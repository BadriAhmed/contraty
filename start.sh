#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PORT=8001
FRONTEND_PORT=3001
PID_DIR="$PROJECT_DIR/.pids"

mkdir -p "$PID_DIR"
BACKEND_PID_FILE="$PID_DIR/backend.pid"
FRONTEND_PID_FILE="$PID_DIR/frontend.pid"

stop_services() {
    echo "🛑 Stopping Contraty..."
    for pid_file in "$BACKEND_PID_FILE" "$FRONTEND_PID_FILE"; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null
                echo "   Killed PID $pid ($(basename "$pid_file" .pid))"
            fi
            rm -f "$pid_file"
        fi
    done
    # cleanup any orphaned children
    pkill -f "uvicorn app.main.*$BACKEND_PORT" 2>/dev/null || true
    pkill -f "next dev.*$FRONTEND_PORT" 2>/dev/null || true
    echo "   Done."
}

start_services() {
    echo "🚀 Starting Contraty..."
    echo ""

    # Backend
    echo "📦 Backend → http://localhost:$BACKEND_PORT"
    cd "$PROJECT_DIR/backend"
    source .venv/bin/activate
    nohup uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT --reload \
        > "$PID_DIR/backend.log" 2>&1 &
    echo $! > "$BACKEND_PID_FILE"
    cd "$PROJECT_DIR"

    # Frontend
    echo "🎨 Frontend → http://localhost:$FRONTEND_PORT"
    cd "$PROJECT_DIR/frontend"
    nohup npx next dev -p $FRONTEND_PORT \
        > "$PID_DIR/frontend.log" 2>&1 &
    echo $! > "$FRONTEND_PID_FILE"
    cd "$PROJECT_DIR"

    echo ""
    echo "✅ Both services started (detached)."
    echo "   Logs: .pids/backend.log  .pids/frontend.log"
    echo ""
}

force_stop() {
    echo "💀 Force-killing anything on ports $BACKEND_PORT / $FRONTEND_PORT..."
    fuser -k ${BACKEND_PORT}/tcp 2>/dev/null || true
    fuser -k ${FRONTEND_PORT}/tcp 2>/dev/null || true
    rm -f "$BACKEND_PID_FILE" "$FRONTEND_PID_FILE"
    echo "   Done."
}

case "${1:-start}" in
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 1
        start_services
        ;;
    force|force-restart)
        force_stop
        sleep 1
        start_services
        ;;
    start|*)
        start_services
        ;;
esac
