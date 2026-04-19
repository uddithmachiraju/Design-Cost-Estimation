.PHONY : install-deps

install-deps:
	@echo "Installing dependencies..."
	cd .devcontainer && pip install -r requirements.txt --break-system-packages

generate-JWT-secret:
	python -c "import secrets; print(secrets.token_hex(32))"

run-backend:
	cd backend && \
	gunicorn app.main:app \
	--workers 1 \
	--worker-class uvicorn.workers.UvicornWorker \
	--bind 0.0.0.0:8000 \
	--log-level info \
	--timeout 30 \
	--keep-alive 5 \
	--access-logfile - \
	--error-logfile -