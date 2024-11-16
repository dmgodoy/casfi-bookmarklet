javascript:(function() {
    const jsonUrl = "https://raw.githubusercontent.com/your-repo/serverGroups/main/serverGroups.json"; // Replace with your URL
    
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            // Create the panel
            const panel = document.createElement("div");
            panel.id = "custom-panel";
            panel.style.border = "1px solid #ccc";
            panel.style.padding = "10px";
            panel.style.marginBottom = "20px";
            panel.style.backgroundColor = "#f9f9f9";

            // Create tabs
            const tabs = document.createElement("ul");
            tabs.style.display = "flex";
            tabs.style.listStyleType = "none";
            tabs.style.padding = "0";
            tabs.style.margin = "0 0 10px 0";
            data.serverGroups.forEach(group => {
                const tab = document.createElement("li");
                tab.style.cursor = "pointer";
                tab.style.marginRight = "10px";
                tab.style.padding = "5px 10px";
                tab.style.border = "1px solid #ccc";
                tab.style.backgroundColor = "#eee";
                tab.textContent = group.groupName;

                tab.addEventListener("click", () => {
                    showTable(group);
                });

                tabs.appendChild(tab);
            });
            panel.appendChild(tabs);

            // Create table container
            const tableContainer = document.createElement("div");
            panel.appendChild(tableContainer);

            // Add panel to the page
            const existingPanel = document.querySelector(".existing-panel-class"); // Adjust selector
            existingPanel.parentNode.insertBefore(panel, existingPanel);

            // Show the table for the first group by default
            showTable(data.serverGroups[0]);

            // Function to render the table for a group
            function showTable(group) {
                tableContainer.innerHTML = ""; // Clear previous table

                const table = document.createElement("table");
                table.style.width = "100%";
                table.style.borderCollapse = "collapse";
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ccc; padding: 8px;">Env</th>
                            <th style="border: 1px solid #ccc; padding: 8px;">Server</th>
                        </tr>
                    </thead>
                `;
                const tbody = document.createElement("tbody");

                group.serverList.forEach(envGroup => {
                    const envRow = document.createElement("tr");
                    envRow.innerHTML = `
                        <td style="border: 1px solid #ccc; padding: 8px;" rowspan="${envGroup.servers.length}">${envGroup.Env}</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">${envGroup.servers[0]}</td>
                    `;
                    tbody.appendChild(envRow);

                    envGroup.servers.slice(1).forEach(server => {
                        const serverRow = document.createElement("tr");
                        serverRow.innerHTML = `
                            <td style="border: 1px solid #ccc; padding: 8px;">${server}</td>
                        `;
                        tbody.appendChild(serverRow);
                    });
                });

                table.appendChild(tbody);
                tableContainer.appendChild(table);
            }
        })
        .catch(error => {
            console.error("Error loading JSON data:", error);
            alert("Failed to load data.");
        });
})();
