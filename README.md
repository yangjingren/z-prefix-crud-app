# Getting Started with Z Prefix Crud App

For this project create a .env file in the api folder with the following two items:
Use the following code to generate a hex for the token secret.
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

DB_CONNECTION_STRING=postgresql://postgres:docker@db:5432/warehouse_db
TOKEN_SECRET=paste-the-generated-hex-here

Accounts and items must be created for the App as the seeds are not provided.

## Available Scripts

In the project directory, you can run:

### `npm docker-compose up --build`

Runs the ui.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\

Runs the api.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\

Runs the server.\ Does not seed the server\

#### Layout Main Page/All Items Page
The Navbar has 3 buttons for unauthenticated users:
Login, Register, and All Items
and 4 buttons for authenticated users:
Logout, Create Item, Personal Inventory, and All Items

Items once created will be displayed on the page in a card showing the item name, item description, and quantity.

#### Personal Inventory Page
This is the main page that you are directed to when you log in. It contains cards of all items that you created.
If you have no items, it will display: No items found.

#### Create Item Page
Please fill in the item name, description and quantity.
Item name is capped to 50 chars, description 1000 chars, and quantity is limited to 10 chars and positive int only.

Click Add Item to attempt to add the item, if it is successful, you will be redirected to your personal inventory. 
Otherwise you will remain on the page. You can click cancel to return to your previous page.

#### Details Page
The details page shows up when you click any item card, your own or someone elses.
If you are not the owner of the item, or are not logged in the page will show:
Item Name, Description, Quantity, and a Back Button
If you are logged in and are the owner of the item, you will have three additional buttons:
Toggle Edit, Delete, and Save(only shows up if you are in edit mode)

Toggle Edit to edit your item. The save button will appear in Edit Mode.
Save once you are done editing your item.
The server will respond with the status of the update which will appear in an alert.
You will remain in edit mode unless you toggle edit or leave the page.

You have the option to Delete your item if you created the item.
If the item is successfully deleted, you will be navigated back to your personal inventory.

#### Logout
Click the Logout button to end your session. The session remains until the JSW token expires or you Logout.
The JSW token validates your session and username for the server to use for comparisons once you have been logged in.
The JSW token is created by the server and sent via HTTPonly to the client for continuous auth purposes.

### `npm docker-compose down`
To tear down and remove the containers.
