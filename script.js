(function() {
    const jsonUrl = "https://raw.githubusercontent.com/your-repo/serverGroups/main/serverGroups.json"; // Replace with your URL
    
    // Inject CSS for active tab and clickable environment
    const style = document.createElement("style");
    style.innerHTML = `
        .tab {
            cursor: pointer;
            margin-right: 10px;
            padding: 5px 10px;
            border: 1px solid #ccc;
            background-color: #eee;
        }
        .tab.active {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
        }
        .server-link, .env-link {
            color: #007bff;
            text-decoration: none;
            cursor: pointer;
        }
        .server-link:hover, .env-link:hover {
            text-decoration: underline;
        }
        .env-name {
            font-weight: bold;
            cursor: pointer;
            color: #007bff;
        }
        .env-name:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);

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
            data.serverGroups.forEach((group, index) => {
                const tab = document.createElement("li");
                tab.style.cursor = "pointer";
                tab.style.marginRight = "10px";
                tab.style.padding = "5px 10px";
                tab.style.border = "1px solid #ccc";
                tab.style.backgroundColor = "#eee";
                tab.textContent = group.groupName;

                // Set the tab index
                tab.setAttribute('data-index', index);

                // Add event listener for tab click
                tab.addEventListener("click", () => {
                    // Remove 'active' class from all tabs
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

                    // Add 'active' class to the clicked tab
                    tab.classList.add('active');

                    // Show the corresponding table
                    showTable(group);
                });

                tab.classList.add('tab'); // Add the 'tab' class for later reference
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
                    // Environment row (styled as clickable link)
                    const envRow = document.createElement("tr");
                    envRow.innerHTML = `
                        <td style="border: 1px solid #ccc; padding: 8px;" rowspan="${envGroup.servers.length}" class="env-name">
                            ${envGroup.Env}
                        </td>
                        <td style="border: 1px solid #ccc; padding: 8px;" class="server-name">
                            <a href="ssh://${envGroup.servers[0]}" class="server-link" target="_self">${envGroup.servers[0]}</a>
                        </td>
                    `;
                    tbody.appendChild(envRow);

                    // Server rows for that environment
                    envGroup.servers.slice(1).forEach(server => {
                        const serverRow = document.createElement("tr");
                        serverRow.innerHTML = `
                            <td style="border: 1px solid #ccc; padding: 8px;" class="server-name">
                                <a href="ssh://${server}" class="server-link" target="_self">${server}</a>
                            </td>
                        `;
                        tbody.appendChild(serverRow);
                    });
                });

                table.appendChild(tbody);
                tableContainer.appendChild(table);

                // Add click event to environment to open ssh for each server in the environment
                const envNames = document.querySelectorAll('.env-name');
                envNames.forEach(env => {
                    env.addEventListener('click', (event) => {
                        const envName = event.target.textContent;
                        const groupIndex = data.serverGroups.findIndex(group => 
                            group.serverList.some(envGroup => envGroup.Env === envName)
                        );
                        
                        const envGroup = data.serverGroups[groupIndex].serverList.find(envGroup => envGroup.Env === envName);
                        
                        // Open each server in a new window/tab
                        envGroup.servers.forEach(server => {
                            window.open(`ssh://${server}`, '_blank');
                        });
                    });
                });

                // Add click event to each server to open ssh link in the same tab
                const serverNames = document.querySelectorAll('.server-name');
                serverNames.forEach(server => {
                    server.addEventListener('click', (event) => {
                        const serverName = event.target.textContent;
                        // Use location.href to open in the same tab
                        window.location.href = `ssh://${serverName}`;
                    });
                });
            }

            // Add default active class to the first tab
            tabs.querySelector("li").classList.add('active');
        })
        .catch(error => {
            console.error("Error loading JSON data:", error);
            alert("Failed to load data.");
        });
})();
