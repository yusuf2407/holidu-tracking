# HoliduTracking Chrome DevTools Extension

A Chrome DevTools Extension (Manifest V3) for tracking and displaying events, A/B tests, and tracking data from Holidu website. The extension monitors network requests and displays them in a dedicated DevTools panel.

## Features

### 🎯 Event Tracking
- **Network Request Monitoring**: Automatically monitors `trackBatch` API calls
- **Real-time Event Display**: Shows events as they occur in real-time
- **Multiple Event Types**:
  - Generic Events (with customEventData)
  - Custom Events (JSON formatted)
  - ImpressionSnapshot Events (with offer details)
  - A/B Test Events

### 🔍 Search & Filtering
- **Global Search**: Search across all event fields including:
  - Event types
  - Custom event data (action, category)
  - Generic data fields
  - Snapshot data
- **Search Highlighting**: Matching terms are highlighted in yellow
- **Filter by Event Type**: Toggle visibility of:
  - Custom Events checkbox
  - ImpressionSnapshot Events checkbox

### 📊 Data Display
- **Expandable Values**: Long values are truncated with "Show more/less" toggle
- **Formatted JSON**: Pretty-printed JSON for easy reading
- **Structured Tables**: Events displayed in organized table format
- **Offer Links**: Clickable offer IDs that open in new tabs (for ImpressionSnapshot events)
- **Snapshot Filtering**: Filter offers within ImpressionSnapshot events by OfferId

### 🎨 User Interface
- **Modern Design**: Clean, responsive UI with Holidu branding
- **Color Coding**:
  - BASE versions: Red (#D73900)
  - NEW versions: Green (#39BF16)
  - Primary: Holidu Teal (#00809D)
- **Sticky Header**: Fixed header with logo and clear button
- **Sticky Controls**: Filter controls stay visible while scrolling

### ⚠️ Error Handling
- **404 Detection**: Alerts when trackBatch endpoints return 404 errors
- **Malformed Data**: Gracefully handles invalid JSON and missing data
- **Error Messages**: User-friendly error displays

## Installation

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd holidu-tracking
   ```

2. **Load Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `holidu-tracking` directory

3. **Open DevTools**:
   - Open any webpage (preferably Holidu website)
   - Open Chrome DevTools (F12 or Cmd+Option+I)
   - Look for "HoliduTracking" tab in DevTools panel

## Usage

### Basic Usage

1. **Open DevTools** on a Holidu website page
2. **Navigate to HoliduTracking Panel** - The panel will automatically start monitoring network requests
3. **View Events** - As events are tracked, they appear in the panel in real-time

### Searching Events

- **Type in Search Box**: Enter any term to search across all event fields
- **Clear Search**: Click the X button in the search box
- **Search Highlights**: Matching text is highlighted in yellow

### Filtering Events

- **Show CustomEvents**: Check/uncheck to show/hide custom event data
- **Show ImpressionSnapshot**: Check/uncheck to show/hide impression snapshot events
- **A/B Tests**: Always visible (no toggle)

### Viewing Event Details

- **Expand Long Values**: Click "Show more" to see full content of truncated values
- **View Snapshots**: Click "Show Snapshot" to expand impression snapshot data
- **Filter Offers**: Within snapshots, use the filter box to find specific offers by OfferId
- **Open Offers**: Click on offer IDs to open them in a new tab (preserves URL parameters)

### Clearing Events

- Click the **X button** in the header to clear all displayed events and reload the panel

## Project Structure

```
holidu-tracking/
├── manifest.json              # Extension manifest (Manifest V3)
├── html/
│   └── devtools.html         # DevTools page entry point
├── js/
│   └── devtools.js           # DevTools panel creation script
├── panel/
│   ├── panel.html            # Main panel UI
│   ├── devtools-panel.js     # Panel logic and event handling
│   ├── ab-testing.png        # A/B test icon
│   ├── close.png             # Close/clear icon
│   ├── cogs.png              # Custom event icon
│   └── magnify.png           # Search icon
├── .cursorrules              # Cursor AI coding rules
├── README.md                 # This file
└── CHANGELOG.md              # Version history and changes
```

## Technical Details

### Technology Stack

- **Chrome Extensions API**: Manifest V3
- **Chrome DevTools Extension APIs**: 
  - `chrome.devtools.panels` - Panel creation
  - `chrome.devtools.network` - Network monitoring
  - `chrome.devtools.inspectedWindow` - Inspected window access
- **JavaScript**: ES6+ Vanilla JavaScript (no frameworks)
- **HTML5**: Semantic HTML
- **CSS3**: Modern CSS with Flexbox

### Supported Event Types

1. **Generic Events** (`genericData` present):
   - Displays action, category, and all genericData fields
   - Searchable across all fields

2. **Custom Events** (`customEventData` present, non-impressionSnapshot):
   - Displays formatted JSON
   - Can be toggled on/off

3. **ImpressionSnapshot Events** (`eventType === 'impressionSnapshot'`):
   - Displays page type and total offers
   - Expandable snapshot with all offer details
   - Filterable by OfferId
   - Clickable offer links

4. **A/B Test Events** (`abTests` array present):
   - Shows BASE (red) or NEW (green) versions
   - Displays test names

### Network Monitoring

The extension monitors all network requests and filters for:
- URLs containing `trackBatch`
- POST requests with JSON payloads
- Response status codes (detects 404 errors)

## Browser Compatibility

- **Chrome**: Latest version (Manifest V3 support required)
- **Edge**: Latest version (Chromium-based)
- **Other Chromium browsers**: Should work but not tested

## Development

### Code Style

- Follow `.cursorrules` for coding standards
- Use ES6+ JavaScript features
- Maintain existing color scheme
- Follow Manifest V3 best practices

### Adding New Features

1. Refer to `.cursorrules` for guidelines
2. Check Chrome Extension documentation for latest APIs
3. Maintain backward compatibility
4. Test with various event types
5. Update CHANGELOG.md

## Known Limitations

- Events are cleared on panel reload
- No persistent storage (events lost on extension reload)
- No export functionality
- Search is case-insensitive only
- No time-based filtering

## Troubleshooting

### Extension Not Loading
- Ensure "Developer mode" is enabled
- Check for errors in `chrome://extensions/`
- Verify manifest.json is valid

### Events Not Showing
- Ensure you're on a Holidu website
- Check Network tab for `trackBatch` requests
- Verify requests contain JSON payloads

### Panel Not Appearing
- Close and reopen DevTools
- Check if HoliduTracking tab exists in DevTools
- Reload the extension

## Contributing

1. Follow the coding standards in `.cursorrules`
2. Test thoroughly with various event types
3. Update CHANGELOG.md with changes
4. Maintain code documentation

## License

[Add license information here]

## Author

**Marcel Suetterlin**

## Version

Current Version: **0.5**

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## Resources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome DevTools Extension APIs](https://developer.chrome.com/docs/extensions/reference/devtools/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/migrating/)

