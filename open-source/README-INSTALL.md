# PromptGuard Installation Instructions

This guide provides step-by-step instructions on how to use the `install_promptguard.sh` script to deploy PromptGuard on your server or cPanel environment.

## Phase 1: Running the Installation Script via SSH

**Step 1: Connect to your server**
Open your terminal (Mac/Linux) or Command Prompt/PuTTY (Windows) and connect to your server via SSH:
\`\`\`bash
ssh username@your_server_ip
\`\`\`

**Step 2: Create the script file**
Once logged in, create a new file for the installation script using a text editor like `nano`:
\`\`\`bash
nano install_promptguard.sh
\`\`\`

**Step 3: Paste the code**
Paste the bash script provided into the editor. 
* To save and exit in `nano`, press `Ctrl + O` (then hit `Enter` to confirm the file name), followed by `Ctrl + X`.

**Step 4: Make the script executable**
You need to give the script permission to run. Execute the following command:
\`\`\`bash
chmod +x install_promptguard.sh
\`\`\`

**Step 5: Run the script**
Execute the script to start the automated cloning, installation, and testing process:
\`\`\`bash
./install_promptguard.sh
\`\`\`
*Wait for the script to finish. It will clone the GitHub repository, install the necessary Node.js packages, and run a quick automated test to ensure the server starts without crashing.*

---

## Phase 2: Production Deployment

The script tests the app in the background and then shuts it down. To keep PromptGuard running permanently, follow the instructions for your specific environment:

### Option A: If you are using cPanel
cPanel manages Node.js applications through its graphical interface (using Phusion Passenger).

1. Log in to your **cPanel dashboard** through your web browser.
2. Scroll down to the **Software** section and click on **Setup Node.js App**.
3. Click the **Create Application** button.
4. Fill in the application details:
   * **Node.js version:** Select a recommended version (e.g., 18.x or 20.x).
   * **Application mode:** Production
   * **Application root:** Enter `PromptGuard/open-source` (this is the folder the script just created).
   * **Application URL:** Choose the domain or sub-folder where you want the app to live.
   * **Application startup file:** Enter `app.js`.
5. Click **Create** or **Start App**. 
6. PromptGuard is now live on your selected URL.

### Option B: If you are using a standard Linux Server (Ubuntu/CentOS/Debian)
On a standard server without cPanel, you should use a process manager like `pm2` to keep the application running continuously in the background.

1. Install `pm2` globally:
   \`\`\`bash
   sudo npm install -g pm2
   \`\`\`
2. Navigate to the installation directory:
   \`\`\`bash
   cd PromptGuard/open-source
   \`\`\`
3. Start the application with `pm2`:
   \`\`\`bash
   pm2 start app.js --name "promptguard"
   \`\`\`
4. Configure `pm2` to start on server boot:
   \`\`\`bash
   pm2 startup
   pm2 save
   \`\`\`
5. *(Optional)* If you want to access the app on standard web ports (80/443), you will need to set up a reverse proxy using Nginx or Apache to forward traffic to `http://127.0.0.1:3000`.
