<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare Traffic Analytics</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .data { margin-top: 20px; }
        .status-code { margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Cloudflare Traffic Analytics</h1>
    <p>This page shows the latest Cloudflare traffic data for your website.</p>

    <div id="traffic-data" class="data">
        <p>Loading traffic data...</p>
    </div>

    <script>
        // Replace this URL with your Google Apps Script Web App URL
        const apiUrl = 'https://script.google.com/macros/s/AKfycbzaJtA7W8VyM4Jo-3b_atczZHAG59tqXv8pDqh9_lY2TyDTAq5Bj0nUuPD8ZMiVYHZD/exec'; 

        // Fetch the Cloudflare traffic data
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const trafficDiv = document.getElementById('traffic-data');
                if (data.total_requests === 0) {
                    trafficDiv.innerHTML = '<p>No data available.</p>';
                    return;
                }

                // Display total requests
                let html = `<h3>Total Requests in Last Hour: ${data.total_requests}</h3>`;
                html += '<div class="status-code"><h4>Requests by Status Code:</h4>';
                for (const [statusCode, count] of Object.entries(data.status_code_requests)) {
                    html += `<p>Status Code ${statusCode}: ${count} requests</p>`;
                }
                html += '</div>';
                
                trafficDiv.innerHTML = html;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('traffic-data').innerHTML = '<p>Error loading data.</p>';
            });
    </script>
</body>
</html>
