javascript:fetch("https://raw.githubusercontent.com/your-repo/your-project/main/panelScript.js").then(t=>{if(!t.ok)throw Error(`Failed to load script: ${t.statusText}`);return t.text()}).then(t=>{let e=document.createElement("script");e.type="text/javascript",e.text=t,document.body.appendChild(e)}).catch(t=>{console.error("Error loading the script:",t),alert("Failed to load the script.")});
