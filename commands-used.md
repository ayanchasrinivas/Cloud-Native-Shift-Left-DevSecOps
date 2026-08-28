1) curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
2) chmod +x kubectl && mv kubectl /usr/local/bin/
3) docker cp kind-internal-kubeconfig.yaml jenkins:/tmp/test-kubeconfig.yaml

# for pre-commit hooks
4) pip install pre-commit
5) pip install detect-secrets
5) pre-commit install
6) detect-secrets scan > .secrets.baseline

# for generating co-sign keypair
7) winget install sigstore.cosign
8) cosign generate-key-pair
9) cosign-windows-amd64 generate-key-pair
10) echo "test" | cosign-windows-amd64 sign-blob --key cosign.key --bundle test-signature.bundle -
