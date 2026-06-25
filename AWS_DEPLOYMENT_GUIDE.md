
# 🚀 AWS Deployment Guide (Full-Stack Architecture)

This guide takes your monolithic application and deploys it using professional AWS infrastructure. 

## 🏗️ The Architecture
- **Frontend:** React (Vite) hosted on **Amazon S3** (Static Website Hosting).
- **Backend:** Node.js (Express) running on an **Amazon EC2** instance.
- **Network:** Isolated **VPC** with Public Subnets.
- **Traffic:** **Application Load Balancer (ALB)** routing traffic to the backend instance.
- **DNS:** **Route 53** pointing to the ALB and S3.

---

## 🛠️ Step-by-Step Setup

### Phase 1: Infrastructure as Code (Terraform)
1. Install [Terraform](https://www.terraform.io/).
2. Configure AWS CLI using `aws configure`.
3. Navigate to `/infra` and run:
   ```bash
   terraform init
   terraform apply
   ```
4. This creates your VPC, S3 bucket, EC2 instance, and Load Balancer automatically.

### Phase 2: Manual Backend Setup (First time)
1. SSH into your EC2 instance.
2. Install Node.js & NPM.
3. Clone the repo and start the server:
   ```bash
   node server.js
   ```

### Phase 3: Setup CI/CD
1. Go to your GitHub Repository Settings > Secrets and variables > Actions.
2. Add the following secrets:
   - `AWS_S3_BUCKET`: The name of your frontend bucket.
   - `AWS_ACCESS_KEY_ID`: Your IAM user key.
   - `AWS_SECRET_ACCESS_KEY`: Your IAM secret key.
   - `EC2_HOST`: The public IP of your backend instance.
   - `EC2_SSH_KEY`: Your private `.pem` key content.

---

## 💸 Cost Optimization Strategy (Interview Tip)
To keep within your $50 budget:
- **Use Free Tier:** The `t2.micro` instance is free for 12 months.
- **S3 Hosting:** Costs pennies per month for small apps.
- **ALB Management:** This is the most expensive part ($15-20/mo). 
  - **Interview Answer:** *"I provision the Load Balancer using Terraform for testing and demos. To optimize costs during development, I destroy the load balancer when not in use and update the frontend to point directly to the EC2 IP for local testing."*

## 🎯 Interview Talking Points
- **Monolith to Microservices:** *"The current backend uses modular Express routers. This allows us to easily split the Auth, Hospital, and AI services into independent AWS Lambda functions or ECS containers if we scale."*
- **Security:** *"The backend lives in a custom VPC security group that only accepts traffic from the Load Balancer, protecting it from direct internet attacks."*
- **Automation:** *"I used Terraform for reproducible infrastructure and GitHub Actions for automated deployment to ensure high developer velocity."*
