FROM jenkins/jenkins:lts-jdk17
USER root
ENV KUBECONFIG=/tmp/kind-internal-kubeconfig.yaml

# INSTALL KUBECTL
COPY kind-internal-kubeconfig.yaml /tmp/kind-internal-kubeconfig.yaml
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x kubectl && mv kubectl /usr/local/bin/

# DOCKER CLI
# TALKS to mounted docker.sock file
RUN apt-get update && apt-get install -y ca-certificates curl gnupg && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" \
    > /etc/apt/sources.list.d/docker.list && \
    apt-get update && apt-get install -y docker-ce-cli

# TRIVY
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Cosign
RUN curl -sSfL https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64 -o /usr/local/bin/cosign \
    && chmod +x /usr/local/bin/cosign

# Gitleaks
RUN GITLEAKS_VERSION=$(curl -s https://api.github.com/repos/gitleaks/gitleaks/releases/latest | grep -Po '"tag_name": "v\K[^"]*') && \
    curl -sSfL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" \
    | tar xz -C /usr/local/bin gitleaks

# Python + tools (bandit, checkov, pip-audit, safety, semgrep)
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv && \
    python3 -m venv /opt/devsecops-venv && \
    /opt/devsecops-venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/devsecops-venv/bin/pip install --no-cache-dir bandit checkov pip-audit safety semgrep && \
    for tool in bandit checkov pip-audit safety semgrep; do \
        ln -s /opt/devsecops-venv/bin/$tool /usr/local/bin/$tool; \
    done && \
    rm -rf /var/lib/apt/lists/*

# Maven + Node
RUN apt-get update && apt-get install -y maven nodejs npm jq unzip && \
    rm -rf /var/lib/apt/lists/*

USER jenkins
EXPOSE 8081
