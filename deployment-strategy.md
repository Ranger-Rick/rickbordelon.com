# Deployment Strategy

## Goal

Deploy this containerized Vue application to AWS with:

- Amazon ECR for image storage
- Amazon ECS running on EC2 for container orchestration
- no load balancer
- a direct public IP for the EC2 host
- HTTPS terminated on the EC2 host with `Caddy` and Let's Encrypt
- billing monitoring so you can be alerted when spend crosses a threshold

## Recommended Target Architecture

For the manual AWS setup you described, the recommended layout is:

1. Build the production Docker image for the site.
2. Push that image to Amazon ECR.
3. Run the container in an ECS service on an EC2-backed ECS cluster.
4. Expose the ECS task on a fixed host port such as `8080`.
5. Assign an Elastic IP to the EC2 instance.
6. Run `Caddy` on the EC2 host to listen on ports `80` and `443`.
7. Let `Caddy` obtain and renew Let's Encrypt certificates.
8. Point `rickbordelon.com` and `www.rickbordelon.com` to the Elastic IP.
9. Use AWS Budgets and CloudWatch billing alarms for spend alerts.

## Production Container Notes

The application now uses a production Docker image.

The container:

- builds the site with `bun run build`
- copies the generated `dist/` output into `nginx`
- serves the app on port `80`

This is the image that should be pushed to ECR and used by ECS.

## Why This Is Cheaper

This approach removes the Application Load Balancer completely.

That reduces cost and moving parts, but it also changes a few things:

- you use one EC2 instance as the public entry point
- you point DNS at the instance Elastic IP instead of an ALB
- you do not use ACM for the website certificate
- HTTPS is handled on the EC2 host with `Caddy` and Let's Encrypt
- this is best for a small single-instance site

## Important SSL/TLS Note

Without a load balancer or CloudFront, AWS ACM is not the right certificate path for the website itself.

Reason:

- ACM certificates cannot be directly attached to an ECS task
- ACM certificates cannot be directly attached to a plain EC2-hosted web server unless you export and manage a different certificate source yourself

For this no-load-balancer setup, the practical HTTPS path is:

- `Caddy` running on the EC2 host
- Let's Encrypt certificates issued automatically
- automatic renewal handled by `Caddy`

## Step-By-Step AWS Setup

### 1. Pick Your AWS Region And Naming

Use one AWS region for the full stack unless you have a specific reason not to.

Suggested naming:

- ECR repository: `rickbordelon-com`
- ECS cluster: `rickbordelon-production`
- ECS service: `website-service`
- Task definition family: `website-task`
- EC2 instance name: `rickbordelon-web-1`
- Elastic IP name tag: `rickbordelon-web-eip`

Keep ECR, ECS, and EC2 in the same region.

### 2. Create The ECR Repository

In AWS Console:

1. Open `Amazon ECR`.
2. Click `Create repository`.
3. Choose `Private repository`.
4. Name it `rickbordelon-com`.
5. Leave scan settings enabled if you want basic image scanning.
6. Create the repository.

CLI example:

```bash
aws ecr create-repository --repository-name rickbordelon-com --region <aws-region>
```

### 3. Build And Push The Image To ECR

Authenticate Docker to ECR:

```bash
aws ecr get-login-password --region <aws-region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<aws-region>.amazonaws.com
```

Build the image:

```bash
docker build -t rickbordelon-com .
```

Tag the image:

```bash
docker tag rickbordelon-com:latest <account-id>.dkr.ecr.<aws-region>.amazonaws.com/rickbordelon-com:latest
```

Push the image:

```bash
docker push <account-id>.dkr.ecr.<aws-region>.amazonaws.com/rickbordelon-com:latest
```

For future releases, use version tags such as `2026-05-21` or `v1` instead of only `latest`.

### 4. Prepare The Network

For a first ECS on EC2 deployment with low cost and low complexity, use:

- one VPC
- one public subnet to start
- one public EC2 instance
- one Elastic IP attached to that EC2 instance

For this specific project, a single public subnet is acceptable because you are explicitly optimizing for simplicity and cost over high availability.

If your account already has a usable default VPC, you can use it for the first deployment.

### 5. Create Security Groups

Create one security group for the ECS EC2 instance:

1. Allow inbound `80` from `0.0.0.0/0`.
2. Allow inbound `443` from `0.0.0.0/0`.
3. Allow inbound `22` only from your IP address if you want SSH access.
4. Allow all outbound traffic.

Why only these public ports are needed:

- `Caddy` listens publicly on `80` and `443`
- `Caddy` proxies traffic to the ECS task on `localhost:8080`
- the ECS application port does not need to be exposed publicly

### 6. Create IAM Roles

You need two AWS roles.

### ECS Task Execution Role

Create a role for `Elastic Container Service Task` and attach:

- `AmazonECSTaskExecutionRolePolicy`

This lets ECS pull images from ECR and write logs to CloudWatch.

### ECS EC2 Instance Role

Create a role for `EC2` and attach:

- `AmazonEC2ContainerServiceforEC2Role`
- `AmazonSSMManagedInstanceCore`

This lets the EC2 instance join the ECS cluster and gives you Session Manager access without requiring SSH.

### 7. Create The ECS Cluster

In AWS Console:

1. Open `Amazon ECS`.
2. Create a cluster.
3. Choose the `EC2 Linux + Networking` path if the console offers it, or create a standard ECS cluster and attach EC2 capacity afterward.
4. Name it `rickbordelon-production`.

### 8. Create The EC2 Capacity For ECS

The clean manual setup is:

1. Create a launch template.
2. Use an ECS-optimized Amazon Linux AMI.
3. Choose a small instance type such as `t3.small` to start.
4. Attach the ECS EC2 instance role.
5. Attach the EC2 security group.
6. Enable a public IP if you are placing the instance in a public subnet.
7. Add user data that joins the ECS cluster.
8. Create an Auto Scaling group from the launch template.
9. Set desired capacity to `1`.
10. Set minimum capacity to `1`.
11. Set maximum capacity to `1`.
12. Attach the Auto Scaling group to the ECS cluster as a capacity provider if the console prompts for it.

Example user data:

```bash
#!/bin/bash
echo ECS_CLUSTER=rickbordelon-production >> /etc/ecs/ecs.config
```

Low-cost default:

- one ECS cluster
- one EC2 instance
- one running task

### 9. Allocate And Attach An Elastic IP

In AWS Console:

1. Open `EC2`.
2. Open `Elastic IPs`.
3. Allocate a new Elastic IP.
4. Associate it with the ECS EC2 instance.
5. Record the public IP address.

Why use an Elastic IP:

- the public address remains stable if the instance is stopped and started
- DNS can point to a stable IP

### 10. Install And Configure Caddy On The EC2 Host

`Caddy` will be the public web server on the instance.

It will:

- listen on `80` and `443`
- obtain HTTPS certificates from Let's Encrypt
- proxy requests to the ECS task on `localhost:8080`

You can install it using SSH or Session Manager after the instance is running.

Example high-level steps on the EC2 host:

1. Install `Caddy`.
2. Enable and start the `caddy` service.
3. Copy the repo's example `Caddyfile` to `/etc/caddy/Caddyfile`.
4. Reload `Caddy`.

Example `Caddyfile`:

```caddy
rickbordelon.com, www.rickbordelon.com {
  encode gzip zstd
  reverse_proxy 127.0.0.1:8080
}
```

The same example is checked into this repo at `./Caddyfile`.

Important:

- the DNS records must already point to the Elastic IP before certificate issuance can succeed
- ports `80` and `443` must be reachable from the internet

### 11. Create The Task Definition

In ECS:

1. Create a new task definition.
2. Choose launch type compatibility `EC2`.
3. Name it `website-task`.
4. Set task execution role to the ECS task execution role.
5. Use `bridge` network mode.
6. Add one container.
7. Use the image URI from ECR.
8. Set the container port to `80`.
9. Set the host port to `8080`.
10. Bind the protocol as `TCP`.
11. Add a CloudWatch log group such as `/ecs/website-service`.
12. Set reasonable CPU and memory values for the container.
13. Save the task definition.

Suggested starting resources:

- CPU: `256`
- Memory: `512`

Why use a fixed host port:

- `Caddy` needs a stable local upstream to proxy to
- `127.0.0.1:8080` is simple and predictable for a single-instance deployment

Tradeoff:

- only one copy of this task can bind to port `8080` on the instance at a time
- that is acceptable for this small single-instance project

### 12. Create The ECS Service

In ECS:

1. Open the `rickbordelon-production` cluster.
2. Create a service.
3. Use launch type `EC2`.
4. Select the `website-task` task definition.
5. Name the service `website-service`.
6. Set desired task count to `1`.
7. Do not attach a load balancer.
8. Create the service.

After the service starts, confirm:

- the task is running
- the container is bound on the EC2 host at port `8080`
- `curl http://127.0.0.1:8080` works on the EC2 instance

### 13. Point The Domain To The EC2 Instance

If you use Route 53:

1. Open `Hosted zones`.
2. Open the hosted zone for `rickbordelon.com`.
3. Create an `A` record for `rickbordelon.com` pointing to the Elastic IP.
4. Create an `A` record for `www.rickbordelon.com` pointing to the same Elastic IP.

If DNS is managed outside Route 53:

1. Create an `A` record for `rickbordelon.com` pointing to the Elastic IP.
2. Create an `A` record for `www.rickbordelon.com` pointing to the same Elastic IP.

### 14. Verify HTTPS

Verify all of the following:

1. `http://rickbordelon.com` redirects or serves correctly through `Caddy`.
2. `https://rickbordelon.com` loads with a valid certificate.
3. `https://www.rickbordelon.com` loads with a valid certificate.
4. `systemctl status caddy` shows the service as healthy.
5. `journalctl -u caddy` does not show certificate or proxy errors.
6. The ECS service stays healthy after several minutes.

### 15. Update And Redeploy Later

For each deployment:

1. Build a new Docker image.
2. Tag it with a new version.
3. Push it to ECR.
4. Create a new ECS task definition revision using the new image tag.
5. Update the ECS service to use the new revision.
6. Confirm the service restarts cleanly.
7. Confirm `Caddy` still proxies successfully to `127.0.0.1:8080`.

## Billing Monitoring And Spend Alerts

AWS does not provide a true hard cap that guarantees all charges stop at an exact dollar amount.

What AWS does provide well:

- budget notifications
- CloudWatch billing alarms
- optional budget actions for limited automation

Use both AWS Budgets and a CloudWatch billing alarm.

### 16. Enable Billing Alerts In The Account

In the AWS Billing console:

1. Open `Billing and Cost Management`.
2. Open `Billing preferences`.
3. Enable `Receive CloudWatch billing alerts`.
4. Save changes.

This step is required before CloudWatch can alarm on estimated charges.

### 17. Create An SNS Topic For Alerts

In AWS Console:

1. Open `Amazon SNS`.
2. Create a topic such as `billing-alerts`.
3. Create an email subscription to your email address.
4. Confirm the subscription from your email inbox.

You can reuse this topic for Budgets and CloudWatch alarms.

### 18. Create An AWS Budget

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

### 19. Create A CloudWatch Billing Alarm

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

### 20. Optional: Add Budget Actions Later

If you want AWS to take action when spend crosses a threshold, you can add a budget action.

Examples:

- restrict IAM permissions for deployment users
- invoke automation that stops the EC2 instance
- invoke automation that updates the ECS service desired count to `0`

Do not treat this as a guaranteed hard stop. Billing data can lag, and some charges can continue before the automation runs.

## Cost-Control Defaults For This Project

For a low-risk starting point, use these defaults:

- one ECR repository
- one ECS cluster
- one EC2 instance
- one ECS task
- one Elastic IP
- no load balancer
- no NAT Gateway
- CloudWatch log retention set to `7` or `14` days
- monthly AWS Budget created before production traffic is sent

## Working Recommendation

For this application, the best manual AWS path is:

1. build and tag the production image
2. push the image to Amazon ECR
3. run it on ECS using one EC2 instance
4. bind the ECS task to host port `8080`
5. attach an Elastic IP to the EC2 host
6. use `Caddy` on the EC2 host for HTTPS with Let's Encrypt
7. point DNS directly to the Elastic IP
8. create AWS Budgets and a CloudWatch billing alarm before going live

This keeps the deployment cheaper and simpler than an ALB-based design, while still giving you HTTPS and basic cost controls.
