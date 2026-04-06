.PHONY : install-deps

install-deps:
	@echo "Installing dependencies..."
	cd .devcontainer && pip install -r requirements.txt --break-system-packages
