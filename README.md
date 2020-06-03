# Serverless Capstone 

# Functionality of the application

This application will allow creating/removing/updating/fetching items. Each item can optionally have an attachment image. Each user only has access to items that he/she has created.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection apiId was provided:

![Alt text](images/import-collection-5.png?raw=true "Image 5")
