# Deployment Strategy

## Goal

Deploy this containerized Vue application to AWS, with a path for:

- running the app reliably in production
- attaching a custom domain like `rickbordelon.com`
- enabling SSL/TLS
- keeping AWS costs controlled

## Recommended Deployment Approach

Because the app is already containerized, deploying it as a container is a reasonable default.

### AWS options considered

| Service | Complexity | Cost | Best fit |
|---|---|---:|---|
| AWS App Runner | Low | Low to moderate | Simplest path for a personal containerized website |
| ECS Fargate | Medium | Moderate | More control without managing servers |
| ECS on EC2 | High | Varies | Full control, but more operational work |
| Lightsail Containers | Low | Predictable | Simpler alternative with fewer AWS integrations |

### Recommended starting point

Use **AWS App Runner** first.

Why:

- simplest AWS-managed path for running a containerized web app
- built-in HTTPS support with custom domain integration
- no server management
- easier to operate than ECS for a personal website

## Suggested Deployment Flow

1. Create an **Amazon ECR** repository.
2. Build the Docker image for this app.
3. Push the image to ECR.
4. Create an **AWS App Runner** service that pulls the image from ECR.
5. Configure the app port based on the container setup.
6. Test the default App Runner URL.
7. Later, connect the custom domain and SSL certificate.

## Custom Domain Strategy

To use a domain like `rickbordelon.com`, the common AWS path is:

1. Use **Route 53** for DNS.
2. Either:
   - register the domain in Route 53, or
   - keep the domain at the current registrar and point DNS to Route 53
3. Create a hosted zone for `rickbordelon.com`.
4. Add the domain to the App Runner service.
5. Create the DNS records AWS requires.

If the domain is managed outside AWS, Route 53 is optional, but using Route 53 simplifies DNS validation and AWS integration.

## SSL Certificate Strategy

Use **AWS Certificate Manager (ACM)** for SSL/TLS.

Key points:

- ACM public certificates are free
- certificates renew automatically
- domain ownership is usually validated with DNS records
- if Route 53 is used, validation is usually simpler

Typical certificate coverage:

- `rickbordelon.com`
- `www.rickbordelon.com`
- optionally `*.rickbordelon.com` if subdomains are needed later

## Cost Control Reality in AWS

AWS does **not** provide a true hard spending cap that automatically stops all charges once a dollar amount is reached.

### What AWS does provide

#### AWS Budgets

- set a monthly budget threshold
- send alerts at percentages or dollar amounts
- does **not** stop running services automatically

#### AWS Budget Actions

- can trigger automated actions at thresholds
- may restrict IAM access or stop some resources
- is **not** a guaranteed full-account kill switch
- may not cleanly stop every service type in time

## Practical Cost-Control Plan

Use multiple layers:

1. Set an **AWS Budget** for the monthly maximum you are comfortable with.
2. Add alerts at thresholds like 50%, 80%, and 100%.
3. Keep deployment settings conservative:
   - low instance count
   - low scaling limits
   - only required services enabled
4. Consider a **prepaid or limited-balance card** if a true hard cap matters most.
5. Optionally add automation later:
   - budget alert
   - SNS/Lambda action
   - stop or delete the App Runner service when the budget threshold is reached

### Important limitation

Even with alarms and automation, AWS billing data is not always instant, so spending can overshoot the threshold before shutdown occurs.

If a strict hard cap is required, a limited-payment method is the closest practical option.

## Initial Recommended Plan

### Phase 1: Deploy the app

- confirm the Docker image runs correctly for production
- push the image to ECR
- deploy with App Runner
- verify the app works at the default AWS URL

### Phase 2: Add domain and HTTPS

- set up Route 53 hosted zone if desired
- request/attach ACM certificate
- connect `rickbordelon.com` and optionally `www.rickbordelon.com`
- validate DNS and HTTPS

### Phase 3: Add cost guardrails

- create AWS Budgets
- configure budget notifications
- optionally add automated shutdown actions
- optionally use a prepaid/limited card for a real payment ceiling

## Open Decisions For Later

- whether to use **App Runner** or **ECS Fargate** long term
- whether the domain will be registered/transferred into Route 53 or kept elsewhere
- whether deployments should be manual or automated through CI/CD
- whether budget alerts are sufficient or shutdown automation is needed

## Working Recommendation

For this project, the best initial path is:

- **deploy the existing container to AWS App Runner**
- **use Route 53 for DNS**
- **use ACM for SSL certificates**
- **set AWS Budgets immediately**
- **treat budget alerts as warnings, not a true hard cap**

This gives the simplest first deployment while leaving room to improve automation and cost controls later.
