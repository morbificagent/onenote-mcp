# OneNote MCP Server
[![smithery badge](https://smithery.ai/badge/@modelcontextprotocol/server-onenote)](https://smithery.ai/server/@modelcontextprotocol/server-onenote)

A Model Context Protocol (MCP) server implementation for Microsoft OneNote, enabling AI language models to interact with OneNote through a standardized interface.

## Features

- Authentication with Microsoft OneNote using device code flow
- List all OneNote notebooks
- List sections in notebooks
- List pages in sections
- Create new pages with HTML content
- View page content

## Installation

### Prerequisites

- Node.js 16 or higher
- An active Microsoft account with access to OneNote

### Installation Steps

1. Clone this repository:

```bash
git clone https://github.com/yourusername/onenote-mcp.git
cd onenote-mcp
```

2. Install dependencies:

```bash
npm install
```

## Authentication

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

### How to Authenticate

Run the authentication script:

```bash
node authenticate.js
```

The script will display a URL and a code. Open the URL in your browser and enter the code. After successful authentication, an access token will be saved locally in `.access-token.txt` and you're ready to use the OneNote MCP tools.

## Usage

### Running the MCP Server

To start the MCP server:

```bash
node onenote-mcp.mjs
```

This will start a server that AI systems can interact with using the Model Context Protocol.

### Example Scripts

This repository contains several standalone scripts that demonstrate how to interact with OneNote:

#### 1. List Your Notebooks

```bash
node simple-onenote.js
```

#### 2. List Sections in a Notebook

```bash
node list-sections.js
```

#### 3. List Pages in a Section

```bash
node list-pages.js
```

#### 4. Create a New Page

```bash
node create-page.js
```

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

## Security Notes

- The authentication token is stored locally in `.access-token.txt` and grants access to your OneNote data
- Always keep this token secure and don't commit it to public repositories
- The included `.gitignore` is configured to exclude the token file

## Troubleshooting

### Authentication Issues

- If authentication fails, make sure you're using a modern browser without tracking prevention
- Try clearing browser cookies and cache
- Check that your Microsoft account has access to OneNote
- If you get "expired_token" errors, run `authenticate.js` again to get a fresh token

### Server Won't Start

- Verify that Node.js is installed and is at least version 16
- Check that all dependencies are installed: `npm install`
- Make sure that required modules are available: `npm install node-fetch`

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

## License

This project is licensed under the MIT License - see the LICENSE file for details
