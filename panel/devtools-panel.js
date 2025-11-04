
const abtests = [];
let checked = false;
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
    const strValue = String(value);
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
            if (pushed.customEventData && checked) {
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
  };

  // Function to filter existing events based on search term
  function filterExistingEvents() {
    const allRows = document.querySelectorAll('#content > tr');
    allRows.forEach(row => {
      // Get the event data from the row
      const genericEventDiv = row.querySelector('.genericEvent');
      const customEventPre = row.querySelector('.area');
      
      let shouldShow = false;
      
      if (genericEventDiv) {
        // Extract text content from the generic event table
        const tableText = genericEventDiv.textContent || genericEventDiv.innerText;
        if (!searchTerm || tableText.toLowerCase().includes(searchTerm.toLowerCase())) {
          shouldShow = true;
        }
      } else if (customEventPre) {
        // Extract text content from custom event pre
        const preText = customEventPre.textContent || customEventPre.innerText;
        if (!searchTerm || preText.toLowerCase().includes(searchTerm.toLowerCase())) {
          shouldShow = true;
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
    if (!searchTerm || searchTerm.trim() === '') {
      // Remove all highlights
      document.querySelectorAll('.highlight').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      });
      return;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return;
    
    const escapedSearch = escapeRegex(searchTerm);
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    
    // Function to highlight text in a text node (in all cells, labels and values)
    function highlightTextNode(node) {
      // Skip if already highlighted or in a link
      if (node.parentElement.tagName === 'A' || 
          node.parentElement.classList.contains('hidden') ||
          node.parentElement.classList.contains('highlight')) {
        return;
      }
      
      const text = node.textContent;
      if (!text || text.toLowerCase().indexOf(searchLower) === -1) {
        return;
      }
      
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      
      // Reset regex lastIndex
      regex.lastIndex = 0;
      
      // Get all matches first
      const matches = [];
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0]
        });
      }
      
      // Build fragment with highlights
      matches.forEach(match => {
        // Add text before match
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }
        
        // Add highlighted match
        const highlightSpan = document.createElement('span');
        highlightSpan.className = 'highlight';
        highlightSpan.textContent = match.text;
        fragment.appendChild(highlightSpan);
        
        lastIndex = match.index + match.length;
      });
      
      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }
      
      if (fragment.childNodes.length > 0) {
        node.parentNode.replaceChild(fragment, node);
      }
    }
    
    // Find all text nodes in all table cells (both labels and values)
    const allCells = document.querySelectorAll('#content td');
    allCells.forEach(cell => {
      const walker = document.createTreeWalker(
        cell,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            // Skip text nodes in links, hidden elements, or already highlighted
            if (node.parentElement.tagName === 'A' || 
                node.parentElement.classList.contains('hidden') ||
                node.parentElement.classList.contains('highlight')) {
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
