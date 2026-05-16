# ATSInfra Deployment Guide

## Deployment Options

1. **Docker Compose** - Local development and small deployments
2. **Kubernetes** - Production-grade deployments
3. **Cloud Platforms** - AWS, GCP, Azure

## Docker Compose Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 20GB disk space

### Quick Start

```bash
# Clone repository
git clone https://github.com/atsinfra/atsinfra.git
cd atsinfra

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Access Services

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:4000
- **Grafana**: http://localhost:3001 (admin/admin)
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)

### Stop Services

```bash
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes 1.24+
- kubectl configured
- Helm 3.0+ (optional)
- 8GB RAM minimum per node
- 50GB disk space

### Setup

1. **Create namespace**

```bash
kubectl create namespace atsinfra
```

2. **Create secrets**

```bash
# Database credentials
kubectl create secret generic atsinfra-secrets \
  --from-literal=database-url='postgresql://user:pass@postgres:5432/atsinfra' \
  --from-literal=redis-url='redis://redis:6379' \
  --from-literal=jwt-secret='your-secret-key' \
  --namespace=atsinfra

# S3 credentials
kubectl create secret generic s3-credentials \
  --from-literal=access-key='your-access-key' \
  --from-literal=secret-key='your-secret-key' \
  --namespace=atsinfra
```

3. **Deploy services**

```bash
kubectl apply -f k8s/ --namespace=atsinfra
```

4. **Verify deployment**

```bash
kubectl get pods -n atsinfra
kubectl get services -n atsinfra
```

5. **Access application**

```bash
# Get LoadBalancer IP
kubectl get service frontend -n atsinfra

# Or use port-forward for testing
kubectl port-forward service/frontend 3000:3000 -n atsinfra
```

### Scaling

```bash
# Scale API Gateway
kubectl scale deployment api-gateway --replicas=5 -n atsinfra

# Scale Parser Service
kubectl scale deployment parser-service --replicas=3 -n atsinfra

# Auto-scaling
kubectl autoscale deployment api-gateway \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n atsinfra
```

### Updates

```bash
# Update image
kubectl set image deployment/api-gateway \
  api-gateway=atsinfra/api-gateway:v0.2.0 \
  -n atsinfra

# Rolling update
kubectl rollout status deployment/api-gateway -n atsinfra

# Rollback
kubectl rollout undo deployment/api-gateway -n atsinfra
```

## AWS Deployment

### Using EKS

1. **Create EKS cluster**

```bash
eksctl create cluster \
  --name atsinfra \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.large \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 5
```

2. **Configure kubectl**

```bash
aws eks update-kubeconfig --name atsinfra --region us-east-1
```

3. **Deploy ATSInfra**

```bash
kubectl apply -f k8s/
```

### Using ECS

1. **Create ECR repositories**

```bash
aws ecr create-repository --repository-name atsinfra/frontend
aws ecr create-repository --repository-name atsinfra/api-gateway
aws ecr create-repository --repository-name atsinfra/parser-service
```

2. **Build and push images**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t atsinfra/frontend ./frontend
docker tag atsinfra/frontend:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/atsinfra/frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/atsinfra/frontend:latest
```

3. **Create ECS task definitions and services**

Use AWS Console or Terraform to create ECS resources.

## GCP Deployment

### Using GKE

1. **Create GKE cluster**

```bash
gcloud container clusters create atsinfra \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-2
```

2. **Configure kubectl**

```bash
gcloud container clusters get-credentials atsinfra --zone us-central1-a
```

3. **Deploy ATSInfra**

```bash
kubectl apply -f k8s/
```

## Azure Deployment

### Using AKS

1. **Create AKS cluster**

```bash
az aks create \
  --resource-group atsinfra-rg \
  --name atsinfra \
  --node-count 3 \
  --node-vm-size Standard_D2s_v3 \
  --enable-addons monitoring
```

2. **Configure kubectl**

```bash
az aks get-credentials --resource-group atsinfra-rg --name atsinfra
```

3. **Deploy ATSInfra**

```bash
kubectl apply -f k8s/
```

## Database Setup

### PostgreSQL

**Managed Services:**
- AWS RDS
- GCP Cloud SQL
- Azure Database for PostgreSQL

**Self-hosted:**

```bash
# Using Docker
docker run -d \
  --name postgres \
  -e POSTGRES_USER=atsinfra \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=atsinfra \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# Initialize schema
psql -h localhost -U atsinfra -d atsinfra -f scripts/init-db.sql
```

### Redis

**Managed Services:**
- AWS ElastiCache
- GCP Memorystore
- Azure Cache for Redis

**Self-hosted:**

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:7-alpine redis-server --appendonly yes
```

## Storage Setup

### S3-Compatible Storage

**AWS S3:**

```bash
aws s3 mb s3://atsinfra-uploads
aws s3api put-bucket-versioning \
  --bucket atsinfra-uploads \
  --versioning-configuration Status=Enabled
```

**MinIO (Self-hosted):**

```bash
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=secure_password \
  -v minio_data:/data \
  minio/minio server /data --console-address ":9001"

# Create bucket
mc alias set local http://localhost:9000 admin secure_password
mc mb local/atsinfra-uploads
```

## Monitoring Setup

### Prometheus

```bash
kubectl apply -f monitoring/prometheus.yml
```

### Grafana

```bash
kubectl apply -f monitoring/grafana/
```

Access Grafana:
```bash
kubectl port-forward service/grafana 3001:3000 -n atsinfra
```

Default credentials: admin/admin

## SSL/TLS Setup

### Using cert-manager

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@atsinfra.dev
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### Ingress with TLS

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: atsinfra-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - atsinfra.dev
    secretName: atsinfra-tls
  rules:
  - host: atsinfra.dev
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 3000
```

## Backup and Recovery

### Database Backup

```bash
# Backup
pg_dump -h localhost -U atsinfra atsinfra > backup.sql

# Restore
psql -h localhost -U atsinfra atsinfra < backup.sql
```

### Automated Backups

```bash
# Cron job for daily backups
0 2 * * * pg_dump -h localhost -U atsinfra atsinfra | \
  gzip > /backups/atsinfra-$(date +\%Y\%m\%d).sql.gz
```

## Troubleshooting

### Check Pod Status

```bash
kubectl get pods -n atsinfra
kubectl describe pod <pod-name> -n atsinfra
kubectl logs <pod-name> -n atsinfra
```

### Check Service Connectivity

```bash
kubectl exec -it <pod-name> -n atsinfra -- curl http://api-gateway:4000/health
```

### Database Connection Issues

```bash
kubectl exec -it <pod-name> -n atsinfra -- \
  psql postgresql://user:pass@postgres:5432/atsinfra
```

## Performance Tuning

### Resource Limits

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_parse_results_resume_id ON parse_results(resume_id);

-- Analyze tables
ANALYZE resumes;
ANALYZE parse_results;
```

### Redis Configuration

```
maxmemory 2gb
maxmemory-policy allkeys-lru
```

## Security Checklist

- [ ] Change default passwords
- [ ] Enable TLS/SSL
- [ ] Configure firewall rules
- [ ] Set up API rate limiting
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Secret management (Vault, AWS Secrets Manager)

## Support

For deployment issues:
- GitHub Issues: https://github.com/atsinfra/atsinfra/issues
- Discord: https://discord.gg/atsinfra
- Email: support@atsinfra.dev
