# OneNote MCP Server

A Model Context Protocol (MCP) server implementation for Microsoft OneNote, enabling AI language models to interact with OneNote through a standardized interface.

> This project is based on [azure-onenote-mcp-server](https://github.com/ZubeidHendricks/azure-onenote-mcp-server) by Zubeid Hendricks, with modifications to simplify authentication and improve usability.

## About the Project Structure

This project requires the TypeScript SDK for the Model Context Protocol as a local dependency (`./typescript-sdk/`). Due to size constraints, the SDK is not included directly in this repository.

### Downloading the TypeScript SDK

Before using this project, you'll need to download the TypeScript SDK:

```bash
# After cloning this repo, download the MCP TypeScript SDK
git clone https://github.com/modelcontextprotocol/typescript-sdk.git
```

This approach was chosen for a few reasons:

1. **Compatibility:** The MCP specification is still evolving, and having the SDK directly available ensures compatibility.
2. **Reliability:** Using the SDK as a local dependency prevents issues with version mismatches or breaking changes.
3. **Functionality:** The current implementation relies on specific internal functions from the SDK that may not be available in all published versions.

Without the local copy of the SDK, we encountered various compatibility and import issues that were difficult to resolve.

## Features

- Authentication with Microsoft OneNote using device code flow
- List all OneNote notebooks
- List sections in notebooks
- List pages in sections
- Create new pages with HTML content
- View page content

## Complete Setup Guide

### Prerequisites

- Node.js 16 or higher (install from [nodejs.org](https://nodejs.org/))
- An active Microsoft account with access to OneNote
- Git (install from [git-scm.com](https://git-scm.com/))

### Step 1: Clone the Repository

Open a terminal or command prompt and run:

```bash
git clone https://github.com/yourusername/onenote-mcp.git
cd onenote-mcp
```

### Step 2: Download the TypeScript SDK

Clone the TypeScript SDK repository into the project folder:

```bash
git clone https://github.com/modelcontextprotocol/typescript-sdk.git
cd typescript-sdk
npm install
npm run build
cd ..
```

### Step 3: Install Project Dependencies

In the main project directory, run:

```bash
npm install
```

This will install all required packages including the Microsoft Graph client libraries.

### Step 4: Authenticate with Microsoft

Run the authentication script:

```bash
node authenticate.js
```

The script will output something like:
```
Starting authentication...
You will see a URL and code to enter shortly...

To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code ABCDEF123 to authenticate.
```

1. Open the URL (https://microsoft.com/devicelogin) in your web browser
2. Enter the code displayed in your terminal (e.g., ABCDEF123)
3. Sign in with your Microsoft account
4. Grant the requested permissions to access your OneNote data
5. Return to the terminal and wait for the "Authentication successful!" message

After successful authentication, an access token will be saved to `.access-token.txt` in your project directory.

### Step 5: Test Your Connection

Verify that you can access your OneNote data by listing your notebooks:

```bash
node simple-onenote.js
```

You should see a list of your OneNote notebooks.

### Step 6: Explore Your OneNote Data

Now that you're authenticated, you can run the other scripts:

```bash
# List sections in your first notebook
node list-sections.js

# List pages in the first section of your first notebook
node list-pages.js

# Create a new page in the first section of your first notebook
node create-page.js
```

### Step 7: Running the MCP Server (Optional)

If you want to use the MCP server with AI assistants:

```bash
node onenote-mcp.mjs
```

This will start a server that AI systems can interact with using the Model Context Protocol.

## Authentication Details

This project uses Microsoft's Device Code authentication flow, which provides a secure way to authenticate without exposing your credentials in code.

### How Device Code Authentication Works

1. When you run the authentication script, it contacts Microsoft's authentication service.
2. The service returns a unique device code and a URL.
3. You visit the URL on any device (like your phone or computer) and enter the code.
4. After you sign in with your Microsoft account and grant permissions, the authentication completes on the original device.
5. The access token is saved locally and used for subsequent API calls.

This method is secure because:
- No passwords are stored or transmitted by the application
- The authentication happens directly with Microsoft
- You don't need to create any Azure applications or API keys
- The permissions are explicitly granted by you

## Using with AI Assistants

The server implements the Model Context Protocol, making it compatible with AI assistants that support MCP. The tools provide the following capabilities:

- `authenticate` - Start the authentication flow
- `listNotebooks` - List all notebooks
- `getNotebook` - Get details of a specific notebook
- `listSections` - List sections in a notebook
- `listPages` - List pages in a section
- `getPage` - Get the content of a page
- `createPage` - Create a new page
- `searchPages` - Search pages across notebooks

## Customizing the Scripts

You can use the provided scripts as templates to create your own custom OneNote integration. The key components include:

1. Reading the authentication token from `.access-token.txt`
2. Creating a Graph client with the token
3. Making API calls to the Microsoft Graph OneNote endpoints

Example of how to read the token and initialize a client:

```javascript
// Read the access token
const tokenData = fs.readFileSync('.access-token.txt', 'utf8');
const parsedToken = JSON.parse(tokenData);
const accessToken = parsedToken.token;

// Create Microsoft Graph client
const client = Client.init({
  authProvider: (done) => {
    done(null, accessToken);
  }
});

// Now you can make API calls
const notebooks = await client.api('/me/onenote/notebooks').get();
```

## Security Notes

- The authentication token is stored locally in `.access-token.txt` and grants access to your OneNote data
- Always keep this token secure and don't commit it to public repositories
- The included `.gitignore` is configured to exclude the token file
- The token will expire after a period of time (usually 1 hour), requiring re-authentication

## Troubleshooting

### TypeScript SDK Issues

- If you encounter errors related to the TypeScript SDK, make sure you've:
  - Cloned the repository into the correct location (`./typescript-sdk/`)
  - Installed its dependencies (`cd typescript-sdk && npm install`)
  - Built the SDK (`cd typescript-sdk && npm run build`)

### Authentication Issues

- If authentication fails, make sure you're using a modern browser without tracking prevention
- Try clearing browser cookies and cache
- Check that your Microsoft account has access to OneNote
- If you get "expired_token" errors, run `authenticate.js` again to get a fresh token

### Server Won't Start

- Verify that Node.js is installed and is at least version 16
  - Run `node --version` to check your version
- Check that all dependencies are installed: `npm install`
- Make sure that required modules are available: `npm install node-fetch`
- If you see "SyntaxError: Cannot use import statement outside a module", make sure your package.json has `"type": "module"`

### API Rate Limits

Microsoft Graph API has rate limits. If you encounter errors like "Too many requests" or error code 429, you might need to:
- Reduce the frequency of requests
- Add a delay between API calls
- Implement exponential backoff for retries

### Module Resolution Errors

If you encounter errors about missing modules:
- Make sure `package.json` has `"type": "module"` for ES modules
- Run `npm install` to ensure all dependencies are installed
- If specific modules are complained about, install them directly: `npm install <module-name>`

## Credits

This project builds upon the [azure-onenote-mcp-server](https://github.com/ZubeidHendricks/azure-onenote-mcp-server) by Zubeid Hendricks, with a focus on simplifying the authentication process and providing more straightforward examples.

## License

This project is licensed under the MIT License - see the LICENSE file for details
