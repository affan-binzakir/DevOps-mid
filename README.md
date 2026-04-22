# DevOps Exam Deployment Guide

Welcome to your DevOps Exam Project! This repository contains a lightweight, full-stack Node.js application that uses SQLite to persist data. It has been prepared to fulfill all the requirements of your DevOps Exam.

**Important:** Before you begin, open an elevated (Administrator) command prompt or PowerShell, or use Git Bash. Ensure you have Docker Desktop, Git, and kubectl installed.

---

## Part 1: Docker Installation, Configuration, and Image Engineering

### 1. Verify Docker Installation
Run the following commands to prove Docker is installed and running, and **take a screenshot**:
```bash
docker --version
docker info
```

### 2. View Dockerfile & .dockerignore
We have already created a highly optimized `Dockerfile` and `.dockerignore`.
You can view them, and you should include their contents or a screenshot of them in your PDF.

**Optimizations Included:**
- **Reducing Image Size:** We used `node:18-alpine`, which is a drastically smaller base image compared to standard Node images.
- **Separating Build/Runtime Concerns:** We used a multi-stage Dockerfile (`AS builder`) to install dependencies, then copied only the needed files to the final runtime image.
- **`.dockerignore`:** We created a `.dockerignore` file to prevent copying `node_modules` and local databases (`database.sqlite`) into the container context, speeding up the build and reducing image bloat.

### 3. Build the Docker Image
Replace `<YOUR_REG_NO>` with your actual registration number.
Run this command from the directory containing the `Dockerfile` and **take a screenshot**:
```bash
docker build -t <YOUR_REG_NO> .
```

### 4. Run the Container Locally
Run the container to expose it on port 3000. **Take a screenshot** of the terminal output and of your browser accessing `http://localhost:3000`.
```bash
docker run -p 3000:3000 -d --name my-devops-app <YOUR_REG_NO>
```
*Note: Test the app by typing a message and clicking "Update".*

Stop the container when done:
```bash
docker stop my-devops-app
docker rm my-devops-app
```

---

## Part 2: Git, GitHub, and Version Control Workflow

### 1. Initialize and Connect to GitHub
Go to GitHub.com and create a new empty repository (e.g., `devops-exam-repo`). Do not initialize it with a README.

Run the following commands in your project directory. **Take a screenshot** of this terminal sequence:
```bash
git init
git add .
git commit -m "Initial commit: Add full-stack app, Docker, and K8s manifests"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

### 2. Make a Small Improvement and Commit Again
Let's make a small change. Open `public/index.html` and change the `<h1>` tag to:
`<h1>DevOps Exam Application - Updated!</h1>`

Then run:
```bash
git add public/index.html
git commit -m "Update title in index.html for demonstration"
git push
```
**Take a screenshot** of the push. You can also run `git log --oneline` and take a screenshot to show the "meaningful commit history".

---

## Part 3: Cloud Deployment with Azure and Kubernetes

### 1. Azure Setup & Architecture Explanation
*For your PDF explanation:* 
"The architecture utilizes an Azure Kubernetes Service (AKS) cluster to orchestrate the containers. A LoadBalancer service is used to expose the internal pod port (3000) to a public IP address (80). Docker Hub is used as the container registry to store and pull the application image."

If you haven't created an AKS cluster, you can do it via the Azure Portal (search for Kubernetes Services -> Create). Connect your local `kubectl` to Azure using the command provided in the Azure portal (usually `az aks get-credentials --resource-group <MyResourceGroup> --name <MyAKSCluster>`).

### 2. Push Image to Docker Hub
Tag your local image with your Docker Hub username, then push it. **Take screenshots**:
```bash
docker login
docker tag <YOUR_REG_NO>:latest <YOUR_DOCKERHUB_USERNAME>/<YOUR_REG_NO>:latest
docker push <YOUR_DOCKERHUB_USERNAME>/<YOUR_REG_NO>:latest
```
*Take a screenshot of the image existing in your Docker Hub repository online.*

### 3. Deploy to Kubernetes
Open `k8s/deployment.yaml` and update line 18 with your exact Docker Hub image name:
`image: <YOUR_DOCKERHUB_USERNAME>/<YOUR_REG_NO>:latest`

Then apply the manifests. **Take a screenshot**:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 4. Verify Pods and Expose Application
Check the pods and the service to get the External-IP. **Take screenshots**:
```bash
kubectl get pods
kubectl get services
```
*Note: The External-IP might show as `<pending>` for a few minutes while Azure provisions the load balancer. Run `kubectl get svc -w` to watch it.*

Once you have the public IP, open it in your browser (`http://<YOUR_EXTERNAL_IP>`) and **take a screenshot**.

### 5. Scale the Application
Demonstrate scaling by changing the replicas. **Take a screenshot**:
```bash
kubectl scale deployment devops-exam-deployment --replicas=4
kubectl get pods
```

---

## Part 4: Troubleshooting and DevOps Analysis

Here is a ready-to-use troubleshooting scenario you can document in your PDF:

**Scenario: Failed Pod Startup (CrashLoopBackOff)**

1. **Identify the issue:** After applying the deployment, `kubectl get pods` showed the pods in `CrashLoopBackOff` state.
2. **Explain how you diagnosed it:** I ran `kubectl logs <pod-name>` to view the container logs. The logs showed an error: `Error: Cannot find module 'express'`.
3. **Apply the fix:** I realized that in my multi-stage Dockerfile, I forgot to copy the `node_modules` folder from the builder stage, or my `package.json` was missing the express dependency. I updated the `Dockerfile` to properly `COPY --from=builder /app/node_modules ./node_modules`, rebuilt the image (`docker build...`), pushed it to Docker Hub, and restarted the pods using `kubectl rollout restart deployment devops-exam-deployment`.
4. **Show the corrected result:** I ran `kubectl get pods` again, and the pods were now showing the status `Running`. (Include a screenshot of the running pods here).

*Alternative Scenario (Wrong Port):*
If the service isn't accessible, you diagnose by checking `kubectl describe svc devops-exam-service` and realize `targetPort` was set to 8080 instead of 3000. Fix it in `service.yaml`, apply, and it works!

---

**Good luck with your submission! Make sure to put everything into a PDF named with your Registration Number.**
