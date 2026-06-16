# Deployment Strategy

## Goal

Deploy this Vue application to AWS with:

- a direct public IP for the EC2 host
- HTTPS terminated on the EC2 host with `Caddy` and Let's Encrypt
- billing monitoring so you can be alerted when spend crosses a threshold

## Deployment Options

There are two viable approaches for this project. The **simple EC2 deployment** is recommended for a personal portfolio site.

### Option A: Simple EC2 Deployment (Recommended)

A single EC2 instance running Docker directly, without ECS orchestration.

**Pros:**
- Simpler mental model - just a VM running Docker
- Easier to SSH in and debug
- Lower learning curve
- No ECS-specific concepts (tasks, services, clusters, IAM roles)
- Fewer moving parts to configure and maintain

**Cons:**
- Manual scaling (need to set up Auto Scaling Groups if needed later)
- You manage container restarts yourself (via systemd or Docker restart policies)
- No built-in rolling deployments

### Option B: ECS on EC2

Container orchestration with Amazon ECS running on an EC2-backed cluster.

**Pros:**
- Built-in service management, health checks, auto-restart
- Rolling deployments out of the box
- Easier horizontal scaling if needed later

**Cons:**
- More moving parts (task definitions, services, clusters, multiple IAM roles)
- Debugging is harder
- Overkill for a simple static site
- More complex initial setup

### Verdict

For a personal portfolio site, **Option A (simple EC2)** is the better choice. ECS adds complexity without meaningful benefit for a single-instance static site.

---

## Recommended Target Architecture (Simple EC2)

1. Launch an EC2 instance with Docker installed.
2. Pull or build the production Docker image on the instance.
3. Run the container with Docker, exposing port `8080`.
4. Assign an Elastic IP to the EC2 instance.
5. Run `Caddy` on the EC2 host to listen on ports `80` and `443`.
6. Let `Caddy` obtain and renew Let's Encrypt certificates.
7. Point `rickbordelon.com` and `www.rickbordelon.com` to the Elastic IP.
8. Use AWS Budgets and CloudWatch billing alarms for spend alerts.

## Production Container Notes

The application uses a production Docker image that:

- builds the site with `bun run build`
- copies the generated `dist/` output into `nginx`
- serves the app on port `80`

## SSL/TLS Note

Without a load balancer or CloudFront, AWS ACM is not the right certificate path.

ACM certificates cannot be directly attached to an EC2-hosted web server. For this setup, the practical HTTPS path is:

- `Caddy` running on the EC2 host
- Let's Encrypt certificates issued automatically
- automatic renewal handled by `Caddy`

---

## Step-By-Step AWS Setup (Simple EC2)

### 1. Pick Your AWS Region And Naming

Use one AWS region for the full stack.

Suggested naming:

- EC2 instance name: `rickbordelon-web-1`
- Elastic IP name tag: `rickbordelon-web-eip`
- Security group: `rickbordelon-web-sg`

### 2. Create A Security Group

Create one security group for the EC2 instance:

1. Allow inbound `80` from `0.0.0.0/0`.
2. Allow inbound `443` from `0.0.0.0/0`.
3. Allow inbound `22` only from your IP address for SSH access.
4. Allow all outbound traffic.

Why only these public ports:

- `Caddy` listens publicly on `80` and `443`
- `Caddy` proxies traffic to the Docker container on `localhost:8080`
- the container port does not need to be exposed publicly

### 3. Create An IAM Role For EC2 (Optional)

If you want Session Manager access without SSH, create a role for `EC2` and attach:

- `AmazonSSMManagedInstanceCore`

This is optional but useful for secure shell access without opening port 22.

### 4. Launch The EC2 Instance

In AWS Console:

1. Open `EC2`.
2. Click `Launch instance`.
3. Name it `rickbordelon-web-1`.
4. Choose `Amazon Linux 2023` or `Ubuntu 24.04 LTS`.
5. Choose instance type `t3.micro` or `t3.small`.
6. Select or create a key pair for SSH access.
7. Select the security group you created.
8. Enable `Auto-assign public IP` or plan to attach an Elastic IP.
9. Attach the IAM role if you created one.
10. Launch the instance.

### 5. Allocate And Attach An Elastic IP

In AWS Console:

1. Open `EC2` > `Elastic IPs`.
2. Allocate a new Elastic IP.
3. Associate it with the EC2 instance.
4. Record the public IP address.

Why use an Elastic IP:

- the public address remains stable if the instance is stopped and started
- DNS can point to a stable IP

### 6. Install Docker On The EC2 Instance

SSH into the instance and run:

**Amazon Linux 2023:**

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user
```

**Ubuntu:**

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

Log out and back in for the group change to take effect.

### 7. Build Or Pull The Docker Image

**Option A: Build on the instance**

Clone the repo and build:

```bash
git clone <your-repo-url> ~/app
cd ~/app
docker build -t rickbordelon-com .
```

**Option B: Pull from a registry**

If you push to Docker Hub or ECR:

```bash
docker pull <registry>/rickbordelon-com:latest
docker tag <registry>/rickbordelon-com:latest rickbordelon-com:latest
```

### 8. Run The Docker Container

Run the container with automatic restart:

```bash
docker run -d \
  --name website \
  --restart unless-stopped \
  -p 8080:80 \
  rickbordelon-com:latest
```

Verify it's running:

```bash
curl http://127.0.0.1:8080
```

### 9. Install And Configure Caddy

`Caddy` will be the public web server on the instance.

**Amazon Linux 2023:**

The Caddy COPR repository does not have native Amazon Linux 2023 builds. Since Amazon Linux 2023 is RHEL 9-compatible, use the EPEL 9 repository instead:

```bash
sudo dnf install -y 'dnf-command(copr)'

# Detect architecture and use the appropriate EPEL 9 repo
ARCH=$(uname -m)
if [ "$ARCH" = "aarch64" ]; then
  sudo dnf copr enable -y @caddy/caddy epel-9-aarch64
else
  sudo dnf copr enable -y @caddy/caddy epel-9-x86_64
fi

sudo dnf install -y caddy
```
Create the Caddyfile:

```bash
sudo tee /etc/caddy/Caddyfile << 'EOF'
rickbordelon.com, www.rickbordelon.com {
  encode gzip zstd
  reverse_proxy 127.0.0.1:8080
}
EOF
```

Enable and start Caddy:

```bash
sudo systemctl enable caddy
sudo systemctl start caddy
```

Important:

- DNS records must already point to the Elastic IP before certificate issuance can succeed
- ports `80` and `443` must be reachable from the internet

### 10. Point The Domain To The EC2 Instance

If you use Route 53:

1. Open `Hosted zones`.
2. Open the hosted zone for `rickbordelon.com`.
3. Create an `A` record for `rickbordelon.com` pointing to the Elastic IP.
4. Create an `A` record for `www.rickbordelon.com` pointing to the same Elastic IP.

If DNS is managed elsewhere, create the same `A` records with your DNS provider.

### 11. Verify HTTPS

Verify all of the following:

1. `http://rickbordelon.com` redirects to HTTPS.
2. `https://rickbordelon.com` loads with a valid certificate.
3. `https://www.rickbordelon.com` loads with a valid certificate.
4. `sudo systemctl status caddy` shows the service as healthy.
5. `sudo journalctl -u caddy` does not show certificate or proxy errors.

### 12. Update And Redeploy Later

For each deployment:

```bash
# SSH into the instance
cd ~/app
git pull

# Rebuild and restart the container
docker build -t rickbordelon-com .
docker stop website
docker rm website
docker run -d \
  --name website \
  --restart unless-stopped \
  -p 8080:80 \
  rickbordelon-com:latest
```

Or create a simple deploy script on the instance.

---

## Billing Monitoring And Spend Alerts

AWS does not provide a true hard cap that guarantees all charges stop at an exact dollar amount.

What AWS does provide:

- budget notifications
- CloudWatch billing alarms
- optional budget actions for limited automation

Use both AWS Budgets and a CloudWatch billing alarm.

### 13. Enable Billing Alerts In The Account

In the AWS Billing console:

1. Open `Billing and Cost Management`.
2. Open `Billing preferences`.
3. Enable `Receive CloudWatch billing alerts`.
4. Save changes.

This step is required before CloudWatch can alarm on estimated charges.

### 14. Create An SNS Topic For Alerts

In AWS Console:

1. Open `Amazon SNS`.
2. Create a topic such as `billing-alerts`.
3. Create an email subscription to your email address.
4. Confirm the subscription from your email inbox.

You can reuse this topic for Budgets and CloudWatch alarms.

### 15. Create An AWS Budget

In the Billing console:

1. Open `Budgets`.
2. Create a new budget.
3. Choose `Cost budget`.
4. Set the budget period to `Monthly`.
5. Enter the amount you do not want to exceed.
6. Add alert thresholds such as `50%`, `80%`, and `100%`.
7. Send notifications to the SNS topic or directly to email.
8. Save the budget.

Example:

- monthly budget: `$25`
- alert at `$12.50`
- alert at `$20`
- alert at `$25`

### 16. Create A CloudWatch Billing Alarm

In CloudWatch:

1. Switch to the `us-east-1` region.
2. Open `Alarms`.
3. Create an alarm.
4. Select metric `Billing`.
5. Select `Total Estimated Charge`.
6. Set the currency to `USD` if applicable.
7. Set the threshold amount you want to monitor.
8. Send alarm notifications to the SNS topic.
9. Create the alarm.

Important:

- billing metrics are published in `us-east-1`
- this alarm is useful as a second line of visibility alongside AWS Budgets

---

## Cost-Control Defaults For This Project

For a low-risk starting point, use these defaults:

- one EC2 instance (`t3.micro` or `t3.small`)
- one Elastic IP
- no load balancer
- no NAT Gateway
- no ECS/ECR (unless you want centralized image storage)
- monthly AWS Budget created before production traffic is sent

---

## Alternative: Even Simpler Static Deployment

If you want to skip Docker entirely, you can:

1. Build the static files locally: `bun run build`
2. Copy the `dist/` directory to the EC2 instance
3. Serve directly with Caddy or nginx

Example Caddyfile for static files:

```caddy
rickbordelon.com, www.rickbordelon.com {
  encode gzip zstd
  root * /var/www/rickbordelon.com
  file_server
}
```

This removes Docker from the equation entirely, which may be simpler for a static site.

---

## ECS Deployment (Reference)

The original ECS-based deployment instructions are preserved below for reference. Use these only if you specifically want container orchestration features.

<details>
<summary>Click to expand ECS deployment instructions</summary>

### ECS Setup Overview

This approach uses:

- Amazon ECR for image storage
- Amazon ECS running on EC2 for container orchestration
- Same Caddy + Let's Encrypt setup for HTTPS

### Create The ECR Repository

In AWS Console:

1. Open `Amazon ECR`.
2. Click `Create repository`.
3. Choose `Private repository`.
4. Name it `rickbordelon-com`.
5. Create the repository.

CLI example:

```bash
aws ecr create-repository --repository-name rickbordelon-com --region <aws-region>
```

### Build And Push The Image To ECR

Authenticate Docker to ECR:

```bash
aws ecr get-login-password --region <aws-region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<aws-region>.amazonaws.com
```

Build, tag, and push:

```bash
docker build -t rickbordelon-com .
docker tag rickbordelon-com:latest <account-id>.dkr.ecr.<aws-region>.amazonaws.com/rickbordelon-com:latest
docker push <account-id>.dkr.ecr.<aws-region>.amazonaws.com/rickbordelon-com:latest
```

### Create IAM Roles

You need two AWS roles:

**ECS Task Execution Role** - Create a role for `Elastic Container Service Task` and attach:
- `AmazonECSTaskExecutionRolePolicy`

**ECS EC2 Instance Role** - Create a role for `EC2` and attach:
- `AmazonEC2ContainerServiceforEC2Role`
- `AmazonSSMManagedInstanceCore`

### Create The ECS Cluster

1. Open `Amazon ECS`.
2. Create a cluster named `rickbordelon-production`.
3. Choose `EC2 Linux + Networking`.

### Create EC2 Capacity For ECS

1. Create a launch template with an ECS-optimized AMI.
2. Choose `t3.small` instance type.
3. Attach the ECS EC2 instance role.
4. Add user data: `#!/bin/bash\necho ECS_CLUSTER=rickbordelon-production >> /etc/ecs/ecs.config`
5. Create an Auto Scaling group with desired/min/max capacity of `1`.

### Create The Task Definition

1. Create task definition named `website-task`.
2. Launch type: `EC2`.
3. Network mode: `bridge`.
4. Container port: `80`, Host port: `8080`.
5. CPU: `256`, Memory: `512`.

### Create The ECS Service

1. Create service named `website-service`.
2. Task definition: `website-task`.
3. Desired count: `1`.
4. No load balancer.

### ECS Redeployment

1. Build and push new image to ECR.
2. Create new task definition revision.
3. Update service to use new revision.

</details>
