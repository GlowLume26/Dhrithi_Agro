# Drithi Agro — Docker & AWS Deployment Guide

## Docker Setup

### docker-compose.yml
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: drithi-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: drithi_agro
      MYSQL_USER: drithiuser
      MYSQL_PASSWORD: drithipass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    networks:
      - drithi-network

  backend:
    build: ./backend
    container_name: drithi-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/drithi_agro
      SPRING_DATASOURCE_USERNAME: drithiuser
      SPRING_DATASOURCE_PASSWORD: drithipass
      JWT_SECRET: ${JWT_SECRET}
      AWS_ACCESS_KEY: ${AWS_ACCESS_KEY}
      AWS_SECRET_KEY: ${AWS_SECRET_KEY}
      RAZORPAY_KEY_ID: ${RAZORPAY_KEY_ID}
      RAZORPAY_KEY_SECRET: ${RAZORPAY_KEY_SECRET}
      TWILIO_ACCOUNT_SID: ${TWILIO_ACCOUNT_SID}
      TWILIO_AUTH_TOKEN: ${TWILIO_AUTH_TOKEN}
      TWILIO_FROM_NUMBER: ${TWILIO_FROM_NUMBER}
      MAIL_USERNAME: ${MAIL_USERNAME}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
    depends_on:
      - mysql
    networks:
      - drithi-network

  nginx:
    image: nginx:alpine
    container_name: drithi-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./:/usr/share/nginx/html
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
    networks:
      - drithi-network

volumes:
  mysql_data:

networks:
  drithi-network:
    driver: bridge
```

### backend/Dockerfile
```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### nginx/nginx.conf
```nginx
events { worker_connections 1024; }

http {
  upstream backend {
    server backend:8080;
  }

  server {
    listen 80;
    server_name drithiagro.com www.drithiagro.com;
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl;
    server_name drithiagro.com www.drithiagro.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
      proxy_pass http://backend;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

---

## AWS Deployment Guide

### Architecture
```
Route 53 (DNS)
    ↓
CloudFront (CDN + SSL)
    ↓
Application Load Balancer
    ↓
EC2 Auto Scaling Group (Spring Boot)
    ↓
RDS MySQL (Multi-AZ)
    ↓
S3 (File Storage)
    ↓
ElastiCache Redis (Sessions/Cache)
```

### Step 1 — AWS Infrastructure Setup

#### 1.1 VPC & Networking
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=drithi-agro-vpc}]'

# Create public subnets (2 AZs for HA)
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.1.0/24 --availability-zone ap-south-1a
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.2.0/24 --availability-zone ap-south-1b

# Create private subnets for RDS
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.3.0/24 --availability-zone ap-south-1a
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.4.0/24 --availability-zone ap-south-1b
```

#### 1.2 RDS MySQL
```bash
aws rds create-db-instance \
  --db-instance-identifier drithi-agro-db \
  --db-instance-class db.t3.medium \
  --engine mysql \
  --engine-version 8.0 \
  --master-username admin \
  --master-user-password <strong-password> \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --db-name drithi_agro \
  --vpc-security-group-ids <sg-id> \
  --db-subnet-group-name drithi-subnet-group \
  --backup-retention-period 7 \
  --deletion-protection
```

#### 1.3 S3 Bucket
```bash
aws s3api create-bucket \
  --bucket drithi-agro-uploads \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket drithi-agro-uploads \
  --versioning-configuration Status=Enabled

# Block public access (use CloudFront for serving)
aws s3api put-public-access-block \
  --bucket drithi-agro-uploads \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

#### 1.4 EC2 Launch Template
```bash
aws ec2 create-launch-template \
  --launch-template-name drithi-agro-lt \
  --version-description "v1" \
  --launch-template-data '{
    "ImageId": "ami-0c55b159cbfafe1f0",
    "InstanceType": "t3.medium",
    "SecurityGroupIds": ["<sg-id>"],
    "UserData": "<base64-encoded-startup-script>",
    "IamInstanceProfile": {"Name": "drithi-agro-ec2-role"}
  }'
```

#### 1.5 Auto Scaling Group
```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name drithi-agro-asg \
  --launch-template LaunchTemplateName=drithi-agro-lt,Version='$Latest' \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --target-group-arns <alb-target-group-arn> \
  --vpc-zone-identifier "<subnet-1>,<subnet-2>"
```

#### 1.6 CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --distribution-config '{
    "Origins": {
      "Items": [{
        "Id": "S3Origin",
        "DomainName": "drithi-agro-uploads.s3.ap-south-1.amazonaws.com",
        "S3OriginConfig": {"OriginAccessIdentity": ""}
      }]
    },
    "DefaultCacheBehavior": {
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
    },
    "Enabled": true,
    "PriceClass": "PriceClass_200"
  }'
```

### Step 2 — CI/CD with GitHub Actions

#### .github/workflows/deploy.yml
```yaml
name: Deploy Drithi Agro

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Build Spring Boot
        run: cd backend && mvn package -DskipTests

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Login to ECR
        run: aws ecr get-login-password | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}

      - name: Build & Push Docker image
        run: |
          docker build -t drithi-agro-backend ./backend
          docker tag drithi-agro-backend:latest ${{ secrets.ECR_REGISTRY }}/drithi-agro-backend:latest
          docker push ${{ secrets.ECR_REGISTRY }}/drithi-agro-backend:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster drithi-agro-cluster \
            --service drithi-agro-backend \
            --force-new-deployment

      - name: Deploy frontend to S3 + CloudFront
        run: |
          aws s3 sync . s3://drithiagro.com --exclude "backend/*" --exclude "database/*" --exclude ".git/*"
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} --paths "/*"
```

### Step 3 — Environment Variables (.env)
```env
# Database
DB_HOST=drithi-agro-db.xxxx.ap-south-1.rds.amazonaws.com
DB_NAME=drithi_agro
DB_USER=admin
DB_PASSWORD=<strong-password>

# JWT
JWT_SECRET=<256-bit-random-secret>

# AWS
AWS_ACCESS_KEY=<iam-access-key>
AWS_SECRET_KEY=<iam-secret-key>
AWS_S3_BUCKET=drithi-agro-uploads
AWS_REGION=ap-south-1

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=<razorpay-secret>

# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=<twilio-token>
TWILIO_FROM_NUMBER=+1xxxxxxxxxx

# Email
MAIL_USERNAME=noreply@drithiagro.com
MAIL_PASSWORD=<app-password>
```

---

## Estimated AWS Monthly Cost (Production)

| Service | Config | Est. Cost |
|---------|--------|-----------|
| EC2 (2× t3.medium) | Auto Scaling | ~₹6,000 |
| RDS MySQL (db.t3.medium Multi-AZ) | 100GB | ~₹8,000 |
| S3 Storage | 100GB + requests | ~₹500 |
| CloudFront | 1TB transfer | ~₹1,500 |
| ALB | Standard | ~₹1,200 |
| Route 53 | Hosted zone | ~₹50 |
| **Total** | | **~₹17,250/month** |

> Use [AWS Pricing Calculator](https://calculator.aws) for exact estimates.
