## Installation

### First things first

- You need to have a [CambioToday API Key](https://cambio.today/api), so go in there and create one.

---

There are three ways to setup this project.

### Option 1: The cool way, running it in a Kubernetes cluster.

1. You need to have a Kubernetes cluster set up or run a Kubernetes cluster locally.

   - [Docker](https://docs.docker.com/v17.12/install/).
   - [kubectl](https://kubernetes.io/es/docs/tasks/tools/install-kubectl/).
   - [Skaffold](https://skaffold.dev/docs/install/).
   - [Helm](https://github.com/helm/helm).

2. Setup CambioToday Key.

   Once you have cloned the project, it's time to setup the CambioToday API Key. 
   In order to do that, go to the configuration folder in the [DirmodAPI Service Helm Chart](https://github.com/germmand/DirmodApp/tree/master/chart/dirmodapp/charts/dirmodapiservice/configurations),
   and create a `cambiotoday.conf` file and paste your key in there. There's a template configuration in there just in case.

3. Run it!

   Thanks to Skaffold, it's pretty easy to start developing. Simply run:
   
   `$ skaffold dev`

   And that's it! Skaffold will start building the images automatically as you refactor the code and send those refactored images to the cluster.

4. Accesing the frontend service.

   Once the application is built and running, you can use `kubectl` to find out about pods, deployments, services, etc...
   Let's access the frontend, type:
 
   `$ kubectl get services`

    You're gonna find two services, pick the one called: `dirmodlbwebappservice`. 
    If you're using Minikube then you can find out its external IP by running:

    `$ minikube service dirmodlbwebappservice`

    Your default browser will pop up requesting that service.

5. Cleaning up

   If you used `$ skaffold dev` simply using the combination: `Ctrl + C` will clean up the resources.
   But if you used `$ skaffold run` to clean up the deployed resources then run: `$ skaffold delete`.

And that's it. How cool is that?

### Option 2: Using Docker-Compose

Even though my plan was to focus on Kubernetes, I still added support for [Docker-Compose](https://docs.docker.com/compose/).
So if you don't want to get into Kubernetes yet, you can still run this app using Compose.

1. You need to have installed:

   - [Docker](https://docs.docker.com/v17.12/install/).
   - [Docker-Compose](https://docs.docker.com/compose/install/).

2. Setup the CambioToday Key.

   Before telling Compose to build the images, it needs an environment variable. Yup, the one holding your key.
   Simply type:

   `$ export CAMBIOTODAY_KEY=<your_key_here>`

3. Run it!

   Now, all you have to do is tell compose to run the images. Run:

   `$ docker-compose up -d`

4. Access the frontend,

   Once Compose is finished building and running the images, go to: `http://localhost:3030/`. The app should be up and running. :)
   > **Note**: The reason why I'm using `:3030` and not `:80` is because it might conflict with another process (web-server) running in your computer.
   > So for everything to be smoothly, I set `:3030` as the port. You are free to change it in the Compose file.

5. Cleaning up

   To clean up the resources created by Compose, run: `$ docker-compose down`.
