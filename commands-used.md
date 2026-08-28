1) curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
2) chmod +x kubectl && mv kubectl /usr/local/bin/
3) docker cp kind-internal-kubeconfig.yaml jenkins:/tmp/test-kubeconfig.yaml

# for pre-commit hooks
4) pip install pre-commit