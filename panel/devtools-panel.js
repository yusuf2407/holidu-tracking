
const abtests = [];
let checked = false;

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
                    genericCategory: pushed.customEventData.category,
                    genericLabel: pushed.genericData.f1,
                    genericAction: pushed.customEventData.action,
                    genericF3: pushed.genericData.f3,
                    genericF4: pushed.genericData.f4,
                    genericF5: pushed.genericData.f5,
                };
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
                    <td class="mono">${event.genericAction}</td>
                </tr>
                <tr>
                    <td>customEventData.category (genericCategory)</td>
                    <td class="mono">${event.genericCategory}</td>
                </tr>
                <tr>
                    <td>genericData.f1 (genericLabel)</td>
                    <td class="mono">${event.genericLabel}</td>
                </tr>
                <tr>
                    <td>genericData.f2 (genericValue)</td>
                    <td class="mono">${event.genericValue}</td>
                </tr>
                ${event.genericF3 ? `
                <tr>
                    <td>genericData.f3</td>
                    <td class="mono">${event.genericF3}</td>
                </tr>`
                : ``}
                ${event.genericF4 ? `
                <tr>
                    <td>genericData.f4</td>
                    <td class="mono">${event.genericF4}</td>
                </tr>`
                : ``}
                ${event.genericF5 ? `
                <tr>
                    <td>genericData.f5</td>
                    <td class="mono">${event.genericF5}</td>
                </tr>`
                : ``}
                </tbody>
                </table>
                </div>
                </td>`
                document.getElementById("content").insertBefore(esp, document.getElementById("content").firstChild);

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
