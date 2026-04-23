# DevOps Exam Report

**Name:** [Your Name]
**Registration Number:** [Your Reg No]

---

## Part 1: Docker Installation, Configuration, and Image Engineering

### 1. Docker Installation Verification
I have installed Docker on my system. Below is the proof of the installation showing the Docker version and system info.

> **[ PLACE SCREENSHOT HERE: Output of `docker --version` and `docker info` ]**

### 2. Dockerfile and Image Optimization
A `Dockerfile` and `.dockerignore` were created for the Node.js application.

**Optimizations Applied:**
1. **Reduced Image Size:** Used `node:18-alpine` as the base image instead of the standard node image, which significantly reduces the final container size.
2. **Separation of Build/Runtime Concerns:** Implemented a multi-stage Dockerfile. Dependencies are installed in a `builder` stage, and only the necessary runtime files are copied to the final stage, keeping the image clean and small.
3. **.dockerignore:** Excluded `node_modules` and local databases to prevent bloated builds and ensure a clean environment.

> **[ PLACE SCREENSHOT HERE: Contents of the `Dockerfile` ]**

### 3. Docker Image Build
The Docker image was successfully built using my registration number as the tag.

> **[ PLACE SCREENSHOT HERE: Output of `docker build -t <YOUR_REG_NO> .` ]**

### 4. Running the Container Locally
The application was successfully containerized and run locally. It is accessible via the browser at `http://localhost:3000`.

> **[ PLACE SCREENSHOT HERE: Output of `docker run` command in terminal ]**
> **[ PLACE SCREENSHOT HERE: Browser showing the application running at localhost:3000 ]**

---

## Part 2: Git, GitHub, and Version Control Workflow

### 1. Initialization and Initial Commit
The local repository was initialized, and all files were committed.

> **[ PLACE SCREENSHOT HERE: Terminal showing `git init`, `git add`, and `git commit` commands ]**

### 2. Meaningful Commit History & Second Commit
A small improvement was made to the application, and a second commit was created to demonstrate a meaningful version control workflow.

> **[ PLACE SCREENSHOT HERE: Terminal showing the second commit and the output of `git log --oneline` ]**

### 3. Pushing to GitHub
The code, including Docker files and Kubernetes manifests, was successfully pushed to the remote GitHub repository.

> **[ PLACE SCREENSHOT HERE: Terminal showing `git push` command succeeding ]**

**GitHub Repository Link:** [ Insert Your GitHub Repo Link Here ]

---

## Part 3: Cloud Deployment with Azure and Kubernetes

### 1. Azure Service Architecture
For this deployment, Azure Kubernetes Service (AKS) was utilized to orchestrate the containers. The architecture involves:
- **AKS Cluster:** Hosts the application pods.
- **Docker Hub:** Acts as the container registry where the image is stored and pulled by the AKS nodes.
- **LoadBalancer Service:** A Kubernetes Service of type `LoadBalancer` was used to expose the internal application port (3000) to a public IP address on Azure.

### 2. Pushing to Docker Hub
The Docker image was tagged and pushed to Docker Hub to make it available for the Kubernetes cluster.

> **[ PLACE SCREENSHOT HERE: Terminal showing `docker push` ]**
> **[ PLACE SCREENSHOT HERE: Docker Hub website showing the uploaded image ]**

**Docker Hub Image Link:** [ Insert Your Docker Hub Image Link Here ]

### 3. Kubernetes Deployment and Service
The Kubernetes YAML files (`deployment.yaml` and `service.yaml`) were created and applied to the cluster. The deployment was configured with 2 replicas to ensure high availability.

> **[ PLACE SCREENSHOT HERE: Terminal showing `kubectl apply -f` for both files ]**

### 4. Running Pods and Scaling
The pods were successfully created. The deployment was then scaled to demonstrate the ability to handle increased load.

> **[ PLACE SCREENSHOT HERE: Terminal showing `kubectl get pods` with the initial 2 pods running ]**
> **[ PLACE SCREENSHOT HERE: Terminal showing `kubectl scale` command and the updated running pods ]**

### 5. Public Access of Application
The application was successfully exposed to the public via the LoadBalancer service.

> **[ PLACE SCREENSHOT HERE: Terminal showing `kubectl get services` with the External-IP visible ]**
> **[ PLACE SCREENSHOT HERE: Browser showing the application accessed via the public IP address ]**

**Public URL / IP:** [ Insert Your Public IP Here ]

---

## Part 4: Troubleshooting and DevOps Analysis

During the deployment process, the following realistic issue was encountered and resolved.

**Identified Issue:** Failed Pod Startup (CrashLoopBackOff)
When deploying the application to Kubernetes, `kubectl get pods` showed that the pods were in a `CrashLoopBackOff` state.

**Diagnosis:**
To diagnose the issue, I checked the logs of the failing pod using the command:
`kubectl logs <pod-name>`
The logs revealed the following error: `Error: Cannot find module 'express'`.

**The Fix:**
I realized that my multi-stage `Dockerfile` was missing the command to copy the installed `node_modules` from the builder stage to the final image. I updated the `Dockerfile` to include:
`COPY --from=builder /app/node_modules ./node_modules`
I then rebuilt the Docker image, pushed the updated image to Docker Hub, and restarted the Kubernetes deployment using:
`kubectl rollout restart deployment devops-exam-deployment`

**Corrected Result:**
After applying the fix, the pods started successfully.

> **[ PLACE SCREENSHOT HERE: Terminal showing the `CrashLoopBackOff` status and the `kubectl logs` error ]**
> **[ PLACE SCREENSHOT HERE: Terminal showing the corrected `Running` pods after the fix ]**
