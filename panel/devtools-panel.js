
const abtests = [];
let checked = false;

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
        return `<td class="mono">${escapeHtml(formatted.truncated)}</td>`;
    }
    
    const uniqueId = `value-${fieldId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return `<td class="mono">
        <span class="truncated-value" id="truncated-${uniqueId}">${escapeHtml(formatted.truncated)}... <a href="#" class="expand-toggle" data-target="${uniqueId}">Show more</a></span>
        <span class="full-value hidden" id="full-${uniqueId}">${escapeHtml(formatted.full)} <a href="#" class="expand-toggle" data-target="${uniqueId}">Show less</a></span>
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
                    <td>genericData.${key}</td>
                    ${generateValueCell(pushed.genericData[key], key)}
                </tr>`;
                    }
                });
                
                const esp=document.createElement("tr");
                esp.innerHTML=`
                <td>
                <img src="magnify.png" width="16">
                </td>
                <td colspan="2">
                <div class="genericEvent">
                <table  title="Please note that the mapping is not 100% correct since label/value are sometimes switched up. For confirmation, focus on f1 and f2 values, which are always correct">
                <tbody>
                <tr>
                    <td>customEventData.action (genericAction)</td>
                    ${generateValueCell(event.genericAction, 'action')}
                </tr>
                <tr>
                    <td>customEventData.category (genericCategory)</td>
                    ${generateValueCell(event.genericCategory, 'category')}
                </tr>
                <tr>
                    <td>genericData.f1 (genericLabel)</td>
                    ${generateValueCell(event.genericLabel, 'f1')}
                </tr>
                <tr>
                    <td>genericData.f2 (genericValue)</td>
                    ${generateValueCell(event.genericValue, 'f2')}
                </tr>
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
