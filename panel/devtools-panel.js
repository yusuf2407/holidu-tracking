
const abtests = [];
let checked = false;
let impressionSnapshotChecked = false;
let searchTerm = '';

// Helper function to check if an event matches the search term
function matchesSearch(pushed, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return true; // No search = show all
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    
    // Search in customEventData
    if (pushed.customEventData) {
        if (pushed.customEventData.action && String(pushed.customEventData.action).toLowerCase().includes(searchLower)) {
            return true;
        }
        if (pushed.customEventData.category && String(pushed.customEventData.category).toLowerCase().includes(searchLower)) {
            return true;
        }
        // Search in snapshot array for impressionSnapshot events
        if (pushed.customEventData.snapshot && Array.isArray(pushed.customEventData.snapshot)) {
            for (let snapshotItem of pushed.customEventData.snapshot) {
                if (snapshotItem && typeof snapshotItem === 'object') {
                    for (let key in snapshotItem) {
                        const value = snapshotItem[key];
                        if (value != null && value !== '') {
                            const valueStr = String(value).toLowerCase();
                            if (valueStr.includes(searchLower)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Search in eventType
    if (pushed.eventType && String(pushed.eventType).toLowerCase().includes(searchLower)) {
        return true;
    }
    
    // Search in all genericData fields
    if (pushed.genericData) {
        for (let key in pushed.genericData) {
            const value = pushed.genericData[key];
            if (value != null && value !== '') {
                const valueStr = String(value).toLowerCase();
                if (valueStr.includes(searchLower)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// Helper function to format long values with truncation
function formatLongValue(value, maxLength = 100) {
    if (value == null || value === '') {
        return { truncated: value, full: value, isLong: false };
    }
    
    // Handle objects and arrays by stringifying them
    let strValue;
    if (typeof value === 'object' && value !== null) {
        try {
            strValue = JSON.stringify(value, null, 2);
        } catch (e) {
            strValue = String(value);
        }
    } else {
        strValue = String(value);
    }
    
    if (strValue.length > maxLength) {
        return {
            truncated: strValue.substring(0, maxLength),
            full: strValue,
            isLong: true
        };
    }
    return { truncated: strValue, full: strValue, isLong: false };
}

// Helper function to generate HTML for a value cell with expand/collapse
function generateValueCell(value, fieldId) {
    const formatted = formatLongValue(value);
    if (!formatted.isLong) {
        return `<td class="mono">${highlightSearchTerm(formatted.truncated, searchTerm)}</td>`;
    }
    
    const uniqueId = `value-${fieldId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return `<td class="mono">
        <span class="truncated-value" id="truncated-${uniqueId}">${highlightSearchTerm(formatted.truncated, searchTerm)}... <a href="#" class="expand-toggle" data-target="${uniqueId}">Show more</a></span>
        <span class="full-value hidden" id="full-${uniqueId}">${highlightSearchTerm(formatted.full, searchTerm)} <a href="#" class="expand-toggle" data-target="${uniqueId}">Show less</a></span>
    </td>`;
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (text == null) return '';
    const str = String(text);
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Helper function to highlight matching search terms
function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || !text) {
        return escapeHtml(String(text || ''));
    }
    
    const escapedText = escapeHtml(String(text));
    const searchLower = searchTerm.toLowerCase();
    const textLower = String(text).toLowerCase();
    
    if (!textLower.includes(searchLower)) {
        return escapedText;
    }
    
    // Find all matches (case-insensitive)
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
    return escapedText.replace(regex, '<span class="highlight">$1</span>');
}

// Helper function to escape special regex characters
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Function to attach expand/collapse click handlers
function attachExpandHandlers(element) {
    const toggleLinks = element.querySelectorAll('.expand-toggle');
    toggleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const truncatedEl = document.getElementById(`truncated-${targetId}`);
            const fullEl = document.getElementById(`full-${targetId}`);
            
            if (truncatedEl && fullEl) {
                if (truncatedEl.classList.contains('hidden')) {
                    // Collapse
                    truncatedEl.classList.remove('hidden');
                    fullEl.classList.add('hidden');
                } else {
                    // Expand
                    truncatedEl.classList.add('hidden');
                    fullEl.classList.remove('hidden');
                }
            }
        });
    });
    
    // Attach snapshot expand/collapse handlers
    const snapshotToggles = element.querySelectorAll('.snapshot-toggle');
    snapshotToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const snapshotId = this.getAttribute('data-snapshot-id');
            const snapshotContent = document.getElementById(`snapshot-content-${snapshotId}`);
            const toggleText = this.querySelector('.toggle-text');
            
            if (snapshotContent) {
                if (snapshotContent.classList.contains('hidden')) {
                    snapshotContent.classList.remove('hidden');
                    if (toggleText) toggleText.textContent = 'Hide Snapshot';
                } else {
                    snapshotContent.classList.add('hidden');
                    if (toggleText) toggleText.textContent = 'Show Snapshot';
                }
            }
        });
    });
}

// Helper function to build offer URL
function buildOfferUrl(offerId, baseUrl) {
    if (!offerId || !baseUrl) return null;
    
    try {
        const url = new URL(baseUrl);
        const host = url.origin;
        const params = new URLSearchParams();
        
        // Extract query params from base URL
        const checkin = url.searchParams.get('checkin');
        const checkout = url.searchParams.get('checkout');
        const adults = url.searchParams.get('adults');
        const children = url.searchParams.get('children');
        
        // Add params if they exist
        if (checkin) params.append('checkin', checkin);
        if (checkout) params.append('checkout', checkout);
        if (adults) params.append('adults', adults);
        if (children) params.append('children', children);
        
        const queryString = params.toString();
        return `${host}/d/${offerId}${queryString ? '?' + queryString : ''}`;
    } catch (e) {
        return null;
    }
}

// Helper function to get current page URL dynamically
function getCurrentPageUrl(callback) {
    chrome.devtools.inspectedWindow.eval('window.location.href', function(result, isException) {
        if (!isException && result) {
            callback(result);
        } else {
            callback(null);
        }
    });
}

// Helper function to handle offer link click with dynamic URL
function handleOfferLinkClick(offerId, event) {
    event.preventDefault();
    getCurrentPageUrl(function(currentUrl) {
        const offerUrl = buildOfferUrl(offerId, currentUrl);
        if (offerUrl) {
            window.open(offerUrl, '_blank');
        }
    });
}

// Helper function to render offerId cell with clickable link
function generateOfferIdCell(offerId, baseUrl, fieldId) {
    const highlightedOfferId = highlightSearchTerm(offerId, searchTerm);
    const linkId = `offer-link-${fieldId}`;
    
    return `<td class="mono">
        <a href="#" id="${linkId}" class="offer-link" data-offer-id="${escapeHtml(offerId)}" title="Open offer in new tab (uses current page URL)">
            ${highlightedOfferId}
            <svg class="external-link-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" title="Opens in new tab">
                <path d="M10.5 1.5L1.5 10.5M10.5 1.5H6M10.5 1.5V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a>
    </td>`;
}

// Function to render impressionSnapshot event
function renderImpressionSnapshotEvent(pushed) {
    const customEventData = pushed.customEventData || {};
    const snapshot = customEventData.snapshot || [];
    const pageType = customEventData.pageType || '';
    const baseUrl = pushed.href || ''; // Get URL from payload
    const snapshotId = `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Build snapshot rows
    let snapshotRows = '';
    snapshot.forEach((snapshotItem, index) => {
        if (!snapshotItem || typeof snapshotItem !== 'object') return;
        
        const offerId = snapshotItem.offerId || '';
        let itemRows = '';
        Object.keys(snapshotItem).forEach(key => {
            const value = snapshotItem[key];
            if (value != null && value !== '') {
                // Special handling for offerId
                if (key === 'offerId') {
                    itemRows += `
                <tr class="offer-data-row" data-offer-id="${offerId}" data-offer-index="${index}">
                    <td>${highlightSearchTerm(key, searchTerm)}</td>
                    ${generateOfferIdCell(value, baseUrl, `snapshot-${index}-${key}`)}
                </tr>`;
                } else {
                    itemRows += `
                <tr class="offer-data-row" data-offer-id="${offerId}" data-offer-index="${index}">
                    <td>${highlightSearchTerm(key, searchTerm)}</td>
                    ${generateValueCell(value, `snapshot-${index}-${key}`)}
                </tr>`;
                }
            }
        });
        
        snapshotRows += `
        <tr class="offer-row" data-offer-id="${offerId}" data-offer-index="${index}">
            <td colspan="2" style="padding-left: 20px;">
                <strong>Offer ${index}:</strong>
            </td>
        </tr>
        ${itemRows}`;
    });
    
    const eventInfoRows = `
    <tr>
        <td>${highlightSearchTerm('eventType', searchTerm)}</td>
        ${generateValueCell(pushed.eventType, 'eventType')}
    </tr>
    ${pageType ? `
    <tr>
        <td>${highlightSearchTerm('pageType', searchTerm)}</td>
        ${generateValueCell(pageType, 'pageType')}
    </tr>` : ''}
    <tr>
        <td>${highlightSearchTerm('Total Offers', searchTerm)}</td>
        <td class="mono">${snapshot.length}</td>
    </tr>`;
    
    const esp = document.createElement("tr");
    esp.innerHTML = `
    <td>
        <img src="cogs.png" width="16"/>
    </td>
    <td colspan="2">
        <div class="genericEvent">
            <table>
                <tbody>
                    ${eventInfoRows}
                    <tr>
                        <td colspan="2" style="padding-top: 12px;">
                            <a href="#" class="snapshot-toggle" data-snapshot-id="${snapshotId}">
                                <span class="toggle-text">Show Snapshot</span> (${snapshot.length} offers)
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div id="snapshot-content-${snapshotId}" class="hidden" style="padding-left: 20px; padding-top: 8px;">
                                <div class="snapshot-filter-container" style="margin-bottom: 12px;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                        <input type="text" 
                                               id="snapshot-filter-${snapshotId}" 
                                               class="snapshot-filter-input" 
                                               placeholder="Filter by OfferId..." 
                                               style="flex: 1; padding: 6px 30px 6px 8px; border: 1px solid #D1CCC7; border-radius: 4px; font-size: 12px;">
                                        <button class="snapshot-filter-clear" 
                                                id="snapshot-filter-clear-${snapshotId}" 
                                                style="display: none; background: none; border: none; cursor: pointer; padding: 4px; opacity: 0.6;" 
                                                title="Clear filter">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="snapshot-filter-count" id="snapshot-filter-count-${snapshotId}" style="font-size: 11px; color: #666; display: none;"></div>
                                </div>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tbody id="snapshot-offers-${snapshotId}">
                                        ${snapshotRows}
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>`;
    
    document.getElementById("content").insertBefore(esp, document.getElementById("content").firstChild);
    
    // Hide the row if checkbox is unchecked
    if (!impressionSnapshotChecked) {
        esp.style.display = 'none';
    }
    
    // Attach click handlers for expand/collapse after inserting the element
    setTimeout(() => {
        attachExpandHandlers(esp);
        
        // Attach click handlers for offer links
        const offerLinks = esp.querySelectorAll('.offer-link');
        offerLinks.forEach(link => {
            const offerId = link.getAttribute('data-offer-id');
            if (offerId) {
                link.addEventListener('click', function(e) {
                    handleOfferLinkClick(offerId, e);
                });
            }
        });
        
        // Attach filter functionality
        const filterInput = document.getElementById(`snapshot-filter-${snapshotId}`);
        const filterClear = document.getElementById(`snapshot-filter-clear-${snapshotId}`);
        const filterCount = document.getElementById(`snapshot-filter-count-${snapshotId}`);
        const offersTbody = document.getElementById(`snapshot-offers-${snapshotId}`);
        
        if (filterInput && filterClear && filterCount && offersTbody) {
            // Store total count
            const totalOffers = snapshot.length;
            
            // Filter function
            function applyFilter() {
                const filterValue = filterInput.value.trim().toLowerCase();
                const offerRows = offersTbody.querySelectorAll('.offer-row');
                let visibleCount = 0;
                
                offerRows.forEach(row => {
                    const offerId = row.getAttribute('data-offer-id') || '';
                    const offerIdLower = offerId.toLowerCase();
                    const offerIndex = row.getAttribute('data-offer-index');
                    
                    let shouldShow = false;
                    
                    if (!filterValue || offerIdLower.includes(filterValue)) {
                        shouldShow = true;
                        visibleCount++;
                    }
                    
                    // Show/hide this offer's header row
                    row.style.display = shouldShow ? '' : 'none';
                    
                    // Show/hide all data rows for this offer
                    const dataRows = offersTbody.querySelectorAll(`.offer-data-row[data-offer-index="${offerIndex}"]`);
                    dataRows.forEach(dataRow => {
                        dataRow.style.display = shouldShow ? '' : 'none';
                    });
                });
                
                // Update count display
                if (filterValue) {
                    filterCount.textContent = `Showing ${visibleCount} of ${totalOffers} offers`;
                    filterCount.style.display = 'block';
                    filterClear.style.display = 'block';
                } else {
                    filterCount.style.display = 'none';
                    filterClear.style.display = 'none';
                }
            }
            
            // Input event listener
            filterInput.addEventListener('input', applyFilter);
            
            // Clear button event listener
            filterClear.addEventListener('click', function() {
                filterInput.value = '';
                applyFilter();
                filterInput.focus();
            });
        }
    }, 0);
}

chrome.devtools.network.onRequestFinished.addListener( (req) => {
    if (req.request.url.includes('trackBatch')) {
        // if (req._resourceType === 'preflight') {
        //     const esp=document.createElement("tr");
        //     esp.innerHTML=`
        //     <td>
        //     <img src="cogs.png" width="16"/>
        //     </td>
        //     <td colspan="2">trackbatch - Preflight</td>`
        //     document.getElementById("content").insertBefore(esp, document.getElementById("content").firstChild);
        // }
            if (req.response.status === 404) {
            console.log("hello")
            const esp=document.createElement("tr");
            esp.innerHTML=`
            <td>
            <img src="cogs.png" width="16"/>
            </td>
            <td colspan="2">Error - trackbatch is producing 404 errors.</td>`
            document.getElementById("content").insertBefore(esp, document.getElementById("content").firstChild);
        }
        if (req._resourceType === 'fetch') {
            const payload = JSON.parse(req.request.postData.text);
            payload.forEach(pushed => {
            if (pushed.abTests) {
                pushed.abTests.forEach(el => {
                    if (!abtests.includes(el)) {
                        abtests.push(el);
                        let version;
                        if (el.endsWith('base')) {
                        version = `
                        <td class="verbase">BASE</tr>`;
                        } else {
                        version = `
                            <td class="vernew">NEW</tr>`;
                        }
                        const esp=document.createElement("tr");
                        esp.innerHTML=`
                        <td>
                        <img width="16" src="ab-testing.png">
                        </td>
                        ${version}
                        <td class="mono">${el}</td>`
                        document.getElementById("content").insertBefore(esp, document.getElementById("content").firstChild);
                    }
                });
            }
            if (pushed.genericData) {
                // Check if event matches search term
                if (!matchesSearch(pushed, searchTerm)) {
                    return; // Skip this event if it doesn't match search
                }
                
                const event = {
                    genericValue: pushed.genericData.f2,
                    genericCategory: pushed.customEventData ? pushed.customEventData.category : '',
                    genericLabel: pushed.genericData.f1,
                    genericAction: pushed.customEventData ? pushed.customEventData.action : '',
                };
                
                // Build dynamic rows for all genericData fields except f1 and f2 (which are already displayed)
                let additionalFieldsRows = '';
                const excludedFields = ['f1', 'f2'];
                Object.keys(pushed.genericData).forEach(key => {
                    if (!excludedFields.includes(key) && pushed.genericData[key] != null && pushed.genericData[key] !== '') {
                        additionalFieldsRows += `
                <tr>
                    <td>${highlightSearchTerm(`genericData.${key}`, searchTerm)}</td>
                    ${generateValueCell(pushed.genericData[key], key)}
                </tr>`;
                    }
                });
                
                // Build rows for f1 and f2 only if they have values
                let f1Row = '';
                if (event.genericLabel != null && event.genericLabel !== '') {
                    f1Row = `
                <tr>
                    <td>${highlightSearchTerm('genericData.f1 (genericLabel)', searchTerm)}</td>
                    ${generateValueCell(event.genericLabel, 'f1')}
                </tr>`;
                }
                
                let f2Row = '';
                if (event.genericValue != null && event.genericValue !== '') {
                    f2Row = `
                <tr>
                    <td>${highlightSearchTerm('genericData.f2 (genericValue)', searchTerm)}</td>
                    ${generateValueCell(event.genericValue, 'f2')}
                </tr>`;
                }
                
                const esp=document.createElement("tr");
                esp.innerHTML=`
                <td>
                <img src="magnify.png" width="16">
                </td>
                <td colspan="2">
                <div class="genericEvent">
                <table>
                <tbody>
                <tr>
                    <td>${highlightSearchTerm('customEventData.action (genericAction)', searchTerm)}</td>
                    ${generateValueCell(event.genericAction, 'action')}
                </tr>
                <tr>
                    <td>${highlightSearchTerm('customEventData.category (genericCategory)', searchTerm)}</td>
                    ${generateValueCell(event.genericCategory, 'category')}
                </tr>
                ${f1Row}
                ${f2Row}
                ${additionalFieldsRows}
                </tbody>
                </table>
                </div>
                </td>`
                document.getElementById("content").insertBefore(esp, document.getElementById("content").firstChild);
                
                // Attach click handlers for expand/collapse after inserting the element
                setTimeout(() => {
                    attachExpandHandlers(esp);
                }, 0);

            }
            // Handle impressionSnapshot events separately
            if (pushed.eventType === 'impressionSnapshot' && pushed.customEventData) {
                // Check if event matches search term
                if (!matchesSearch(pushed, searchTerm)) {
                    return; // Skip this event if it doesn't match search
                }
                
                renderImpressionSnapshotEvent(pushed);
            }
            // Handle other customEventData events (non-impressionSnapshot)
            else if (pushed.customEventData && pushed.eventType !== 'impressionSnapshot') {
                // Check if event matches search term
                if (!matchesSearch(pushed, searchTerm)) {
                    return; // Skip this event if it doesn't match search
                }
                
                const esp=document.createElement("tr");
                esp.innerHTML=`
                <td>
                <img src="cogs.png" width="16"/>
                </td>
                <td colspan="2" class="mono">
                <pre class="area">${JSON.stringify(pushed.customEventData, undefined, 4)}</pre></td>`
                document.getElementById("content").insertBefore(esp, document.getElementById("content").firstChild);
                
                // Hide the row if checkbox is unchecked
                if (!checked) {
                    esp.style.display = 'none';
                }
                }
        })

        }
    }

});

  document.getElementById("clear").onclick = function() {
    document.getElementById("content").innerHTML="";
      location.reload();
  };

  document.getElementById("custevt").onchange = function(eb) {
    checked = eb.target.checked;
    filterExistingEvents();
  };

  document.getElementById("impressionSnapshot").onchange = function(eb) {
    impressionSnapshotChecked = eb.target.checked;
    filterExistingEvents();
  };

  // Function to filter existing events based on search term and event type
  function filterExistingEvents() {
    const allRows = document.querySelectorAll('#content > tr');
    allRows.forEach(row => {
      // Get the event data from the row
      const genericEventDiv = row.querySelector('.genericEvent');
      const customEventPre = row.querySelector('.area');
      const snapshotToggle = row.querySelector('.snapshot-toggle');
      
      let shouldShow = false;
      
      if (genericEventDiv) {
        // Check if this is an impressionSnapshot event
        if (snapshotToggle) {
          // ImpressionSnapshot event - must check checkbox state
          if (!impressionSnapshotChecked) {
            shouldShow = false; // Hide if checkbox is unchecked
          } else {
            // Extract text content from the generic event table
            const tableText = genericEventDiv.textContent || genericEventDiv.innerText;
            if (!searchTerm || tableText.toLowerCase().includes(searchTerm.toLowerCase())) {
              shouldShow = true;
            }
          }
        } else {
          // Regular generic event
          const tableText = genericEventDiv.textContent || genericEventDiv.innerText;
          if (!searchTerm || tableText.toLowerCase().includes(searchTerm.toLowerCase())) {
            shouldShow = true;
          }
        }
      } else if (customEventPre) {
        // Custom event rows - must also check checkbox state
        if (!checked) {
          shouldShow = false; // Hide if checkbox is unchecked
        } else {
          // Extract text content from custom event pre
          const preText = customEventPre.textContent || customEventPre.innerText;
          if (!searchTerm || preText.toLowerCase().includes(searchTerm.toLowerCase())) {
            shouldShow = true;
          }
        }
      } else {
        // A/B test rows - check the text content
        const rowText = row.textContent || row.innerText;
        if (!searchTerm || rowText.toLowerCase().includes(searchTerm.toLowerCase())) {
          shouldShow = true;
        }
      }
      
      // Show or hide the row
      if (shouldShow) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  // Function to highlight text in existing DOM elements
  function highlightExistingText() {
    // First, remove all existing highlights
    document.querySelectorAll('.highlight').forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      }
    });
    
    if (!searchTerm || searchTerm.trim() === '') {
      return;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return;
    
    const escapedSearch = escapeRegex(searchTerm);
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    
    // Function to highlight text in a text node (in all cells, labels and values)
    function highlightTextNode(node) {
      // Skip if in a link or hidden element
      let parent = node.parentElement;
      while (parent && parent !== document.body) {
        if (parent.tagName === 'A' || 
            parent.classList.contains('hidden') ||
            parent.classList.contains('highlight')) {
          return;
        }
        parent = parent.parentElement;
      }
      
      const text = node.textContent;
      if (!text || text.toLowerCase().indexOf(searchLower) === -1) {
        return;
      }
      
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      
      // Reset regex lastIndex
      regex.lastIndex = 0;
      
      // Get all matches first
      const matches = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0]
        });
      }
      
      // Build fragment with highlights
      matches.forEach(m => {
        // Add text before match
        if (m.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, m.index)));
        }
        
        // Add highlighted match
        const highlightSpan = document.createElement('span');
        highlightSpan.className = 'highlight';
        highlightSpan.textContent = m.text;
        fragment.appendChild(highlightSpan);
        
        lastIndex = m.index + m.length;
      });
      
      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }
      
      if (fragment.childNodes.length > 0 && node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
      }
    }
    
    // Find all table cells including nested ones (both labels and values)
    // This includes cells in the main table and nested tables inside .genericEvent
    const allCells = document.querySelectorAll('#content td, #content .genericEvent td');
    allCells.forEach(cell => {
      // Skip if cell is empty or only contains links
      if (!cell.textContent || cell.textContent.trim() === '') {
        return;
      }
      
      const walker = document.createTreeWalker(
        cell,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            // Skip text nodes in links
            if (node.parentElement && node.parentElement.tagName === 'A') {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      
      // Highlight all text nodes
      textNodes.forEach(highlightTextNode);
    });
  }

  // Search input event listener
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  
  searchInput.addEventListener('input', function(e) {
    searchTerm = e.target.value;
    
    // Show/hide clear button
    if (searchTerm.trim() !== '') {
      clearSearchBtn.style.display = 'flex';
    } else {
      clearSearchBtn.style.display = 'none';
    }
    
    filterExistingEvents();
    highlightExistingText();
  });
  
  // Clear search button click handler
  clearSearchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    searchInput.value = '';
    searchTerm = '';
    clearSearchBtn.style.display = 'none';
    filterExistingEvents();
    highlightExistingText();
    searchInput.focus();
  });
