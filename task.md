# How to Uploading your project to git 

1. go to your project's root directory via **cmd**
2. run the following command:
   ```shell
   git init
   ```
3. add `.gitignore` file to your project. (see the message in team chat for the contents)
4. `add` your files to `tracked files list` using the following command:
   ```shell
   git add [file_name/or . for all files]
   ```
5. `commit` your files with the following command:
   ```shell
   git commit -m "[commit message]"
   ```
6. go to your [github.com](https://www.github.com) profile
7. create a **new** project with the following settings:
   1. add repository name
   2. description is **optional**
   3. make it **public** for now
   4. **uncheck** `Add Readme.md`
   5. click `continue`
   6. choose `https` in the next screen
   7. copy the command which looks like this:
   ```shell
   git remote add ...
   ```
8. go back to `cmd`
9. paste, and run the command from step `7.7`
10. if everything is going well, you won't see any error
11. `push` your repository to `github` using the following command:
    ```shell
    git push origin main
    ```