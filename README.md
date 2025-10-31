# Nimbus - Salesforce Lightning Chrome Extension

A Chrome extension built with Plasmo, React, Tailwind CSS, and shadcn/ui that adds enhanced functionality to Salesforce Lightning pages.

## Features

- **Salesforce Lightning Integration**: Automatically detects Salesforce Lightning pages (scratch orgs, sandboxes, dev orgs, production)
- **Floating Action Button**: Injects a beautiful floating button on Salesforce forms for quick actions
- **Supabase Authentication**: Built-in authentication system using Supabase
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Fully typed for better developer experience

## Tech Stack

- **Framework**: [Plasmo](https://www.plasmo.com/) - Browser Extension Framework
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript
- **Authentication**: Supabase
- **Icons**: Lucide React

## Project Structure

```
nimbus-extension/
├── assets/               # Extension assets (icons, images)
├── components/
│   └── ui/              # shadcn/ui components (Button, Input, Label)
├── contents/            # Content scripts
│   └── salesforce-button.tsx  # Floating button for Salesforce pages
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Utility functions
├── popup.tsx            # Extension popup with auth UI
├── style.css            # Global styles with Tailwind
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- A Supabase account (for authentication features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/benwestdev/nimbus-extension.git
cd nimbus-extension
```

2. Install dependencies:
```bash
yarn install
```

3. Configure Supabase (optional, but required for auth):
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
   ```env
   PLASMO_PUBLIC_SUPABASE_URL=your_supabase_url
   PLASMO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   - Get these values from your [Supabase project settings](https://app.supabase.com)

### Development

Start the development server:
```bash
yarn dev
```

This will:
- Start the Plasmo development server
- Watch for file changes
- Auto-reload the extension

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `build/chrome-mv3-dev` directory from your project

### Building for Production

Build the extension:
```bash
yarn build
```

The production build will be in the `build/chrome-mv3-prod` directory.

Package the extension:
```bash
yarn package
```

This creates a zip file ready for distribution.

## Usage

### Extension Popup

1. Click the Nimbus extension icon in Chrome
2. Sign in or sign up with your email and password (requires Supabase configuration)
3. Once authenticated, you can access the extension features

### Salesforce Integration

1. Navigate to any Salesforce Lightning page:
   - `*.lightning.force.com/*`
   - `*.my.salesforce.com/*`
   - `*.salesforce.com/*`

2. A floating button will appear in the bottom-right corner of pages with forms

3. Click the button to trigger the placeholder action
   - Current implementation: Shows an alert with a success message
   - Customize the action in `contents/salesforce-button.tsx`

## Customization

### Adding Custom Actions

Edit `contents/salesforce-button.tsx` and modify the `handleClick` function:

```typescript
const handleClick = async () => {
  setIsProcessing(true)
  
  // Your custom logic here
  // Example: Interact with Salesforce DOM, make API calls, etc.
  
  setIsProcessing(false)
}
```

### Adding More UI Components

Install additional shadcn/ui components:
```bash
# Example: Add Card component
yarn add @radix-ui/react-card
```

Then create the component in `components/ui/` following shadcn/ui patterns.

### Styling

- Global styles: Edit `style.css`
- Tailwind configuration: Edit `tailwind.config.js`
- Component styles: Use Tailwind classes directly in JSX

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PLASMO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | No (for auth) |
| `PLASMO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | No (for auth) |

## Permissions

The extension requires the following permissions (defined in `package.json`):
- `host_permissions`: Access to `https://*/*` for Salesforce pages

## Browser Support

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Brave
- Other Chromium-based browsers

## Development Tips

1. **Hot Reload**: Changes to content scripts require reloading the extension or refreshing the page
2. **Debugging**: Use Chrome DevTools for both popup and content script debugging
3. **Console Logs**: Content script logs appear in the page console, not the extension popup console

## Troubleshooting

### Button doesn't appear on Salesforce pages

1. Check that you're on a valid Salesforce Lightning URL
2. Verify the extension is enabled in Chrome
3. Check the console for any errors
4. Try refreshing the page

### Authentication not working

1. Verify Supabase credentials are set in `.env.local`
2. Check that your Supabase project is configured correctly
3. Ensure email authentication is enabled in Supabase dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own extensions.

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] Add more Salesforce-specific actions
- [ ] Implement data sync with Supabase
- [ ] Add keyboard shortcuts
- [ ] Support for Firefox
- [ ] Advanced form automation features
- [ ] Settings page for customization

## Credits

Built with:
- [Plasmo](https://www.plasmo.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)