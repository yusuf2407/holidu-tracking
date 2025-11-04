# Changelog

All notable changes to the HoliduTracking Chrome DevTools Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - Current Version

### Changed
- **Major Version Bump**: Upgraded to version 2.0.0 to reflect significant feature additions and improvements
- Version numbering system standardized for future releases

### Technical Improvements
- Complete feature set from v0.5 consolidated into v2.0.0
- Production-ready release with full documentation
- Chrome Web Store submission ready

## [0.5] - Previous Version

### Added
- **Search Functionality**: Global search across all event fields
  - Search in eventType, customEventData, genericData fields
  - Search in snapshot arrays for impressionSnapshot events
  - Case-insensitive search with highlighting
  - Clear search button with visual feedback
  
- **Search Highlighting**: Matching search terms highlighted in yellow across all displayed content
  - Works in event labels and values
  - Highlights in nested tables and snapshots
  - Real-time highlighting as user types

- **Expandable Long Values**: Truncation and expansion for long field values
  - Values longer than 100 characters are truncated
  - "Show more" / "Show less" toggle buttons
  - Preserves search highlighting in expanded content
  - Works with objects and arrays (JSON stringified)

- **ImpressionSnapshot Event Support**: Full support for impressionSnapshot events
  - Display page type and total offer count
  - Expandable/collapsible snapshot view
  - Individual offer display with all fields
  - Offer filtering by OfferId within snapshots
  - Filter count display (showing X of Y offers)
  - Clear filter button

- **Clickable Offer Links**: Offer IDs in snapshots are clickable
  - Opens offers in new tabs
  - Preserves URL parameters (checkin, checkout, adults, children)
  - Uses current page URL as base
  - External link icon indicator
  - Hover effects for better UX

- **Event Type Filtering**: Checkbox controls for event visibility
  - "Show CustomEvents" checkbox to toggle custom event display
  - "Show ImpressionSnapshot" checkbox to toggle snapshot event display
  - Filtering works with existing events (dynamic show/hide)
  - Search integration with filter checkboxes

- **Error Detection**: 404 error detection for trackBatch endpoints
  - Visual alert when trackBatch returns 404
  - Error message displayed in panel

- **Enhanced UI Controls**: Improved control panel
  - Sticky controls bar that stays visible while scrolling
  - Search wrapper with icon and clear button
  - Better spacing and alignment
  - Responsive design

- **Generic Event Enhancement**: Improved generic event display
  - Shows all genericData fields (not just f1, f2)
  - Properly labeled fields (f1 as genericLabel, f2 as genericValue)
  - Searchable across all generic data fields
  - Consistent formatting

### Changed
- **Event Rendering**: Improved event rendering with better structure
  - More organized table layouts
  - Better visual hierarchy
  - Consistent styling across event types

- **Code Organization**: Better code structure
  - Helper functions for common operations
  - Separation of concerns
  - Improved maintainability

- **Search Integration**: Search works seamlessly with all filters
  - Search respects checkbox filters
  - Filtering works with search terms
  - Combined filtering logic

### Fixed
- **Search Edge Cases**: Handle empty search terms properly
- **Null/Undefined Values**: Proper handling of missing data
- **HTML Escaping**: Prevent XSS with proper HTML escaping
- **Event Filtering**: Correct show/hide logic for all event types

### Technical Improvements
- **Helper Functions Added**:
  - `matchesSearch()`: Comprehensive search matching
  - `formatLongValue()`: Value truncation logic
  - `generateValueCell()`: HTML generation for expandable values
  - `escapeHtml()`: XSS prevention
  - `highlightSearchTerm()`: Search term highlighting
  - `escapeRegex()`: Regex special character escaping
  - `attachExpandHandlers()`: Event listener attachment
  - `buildOfferUrl()`: URL construction for offers
  - `getCurrentPageUrl()`: Dynamic URL retrieval
  - `handleOfferLinkClick()`: Offer link click handling
  - `generateOfferIdCell()`: Offer ID cell generation
  - `renderImpressionSnapshotEvent()`: Snapshot event rendering
  - `filterExistingEvents()`: Dynamic event filtering
  - `highlightExistingText()`: Text highlighting in DOM

- **Event Listeners**: Proper event listener management
  - Search input listener
  - Clear search button listener
  - Checkbox change listeners
  - Expand/collapse toggle listeners
  - Offer link click listeners
  - Snapshot filter input listeners

## [0.4] - Previous Version

### Added
- Basic event tracking functionality
- A/B test event display
- Generic event display
- Custom event display (basic)

### Features
- Network request monitoring for trackBatch
- Real-time event display
- Basic error handling

## [0.3] - Earlier Version

### Added
- Initial DevTools panel creation
- Basic network monitoring
- Simple event display

## [0.2] - Earlier Version

### Added
- Manifest V3 support
- Basic extension structure

## [0.1] - Initial Release

### Added
- Initial extension setup
- Basic panel creation
- Network request interception

---

## Future Planned Features

### Potential Enhancements
- [ ] Export functionality (JSON/CSV)
- [ ] Time-based filtering
- [ ] Event grouping/categorization
- [ ] Statistics/analytics view
- [ ] Configuration options
- [ ] Persistent storage
- [ ] Event timestamps
- [ ] Event rate limiting indicator
- [ ] Dark mode support
- [ ] Keyboard shortcuts

### Known Issues
- Events cleared on panel reload (by design)
- No persistent storage
- Search is case-insensitive only
- No time-based filtering

---

## Version History Summary

- **0.5** (Current): Full-featured event tracking with search, filtering, and enhanced UI
- **0.4**: Basic event tracking with multiple event types
- **0.3**: DevTools panel and network monitoring
- **0.2**: Manifest V3 migration
- **0.1**: Initial release

---

**Note**: This changelog documents all significant changes. For detailed implementation details, refer to the code comments and commit history.

