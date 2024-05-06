var map;
        var markers = [];
        var polyline;

        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 21.0, lng: 82.23 },
                zoom: 10
            });

            fetchDataAndUpdateMap();
            setInterval(fetchDataAndUpdateMap, 5000);
        }

        function fetchDataAndUpdateMap() {
            const apiKey = 'AIzaSyAMDCqRKW6XPHJvxKYqvgr24r4RfhrjAss';
            const spreadsheetId = '1HObmilSg2FHjOtueg9tvRn9N7lwkZAt8RYnRw08v-80';
            const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${apiKey}`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => updateMap(data.values))
                .catch(error => console.error('Error fetching data:', error));
        }

        
        function updateMap(data) {
            markers.forEach(marker => marker.setMap(null));
            markers = [];
            if (polyline) {
                polyline.setMap(null);
            }
        
            if (data.length < 2) {
                console.error('Not enough coordinates to connect.');
                return;
            }
        

            data.forEach((coord, index) => {
                const name = coord[0];
                const latitude = parseFloat(coord[2]); 
                const longitude = parseFloat(coord[3]); 
        
                if (!isNaN(latitude) && !isNaN(longitude)) {
                    const marker = new google.maps.Marker({
                        position: { lat: latitude, lng: longitude },
                        map: map,
                        label: (index + 1).toString(), // Display the number as label
                        title: name,
                        icon: {
                            url: 'survivor.png', // Path to your drone icon
                            scaledSize: new google.maps.Size(24, 24) // Size of the icon
                        }
                    });
                    markers.push(marker);
                }
            });
        
            // Create a Polyline connecting all coordinates with one another
            const coordinates = data.map(coord => ({
                lat: parseFloat(coord[2]), // Change to 3rd column for latitude
                lng: parseFloat(coord[3]) // Change to 4th column for longitude
            }));
        
            polyline = new google.maps.Polyline({
                path: coordinates,
                geodesic: true,
                strokeColor: '#FF0000', // Line color
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
        
            polyline.setMap(map);
        }
        


        function displayCoordinates() {
            const apiKey = 'AIzaSyAMDCqRKW6XPHJvxKYqvgr24r4RfhrjAss';
    const spreadsheetId = '1HObmilSg2FHjOtueg9tvRn9N7lwkZAt8RYnRw08v-80';
            const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${apiKey}`;

            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => showCoordinatesTable(data.values))
                .catch(error => console.error('Error fetching data:', error));
        }

        function showCoordinatesTable(data) {
            const coordinatesTable = document.getElementById('coordinatesTable');
            coordinatesTable.innerHTML = ''; // Clear existing table
        
            // Assuming your data has columns: Name, Timestamp, Latitude, Longitude, Persons Detected
            const headerRow = coordinatesTable.insertRow(0);
            ['s/no', 'Latitude', 'Longitude', 'Persons Detected'].forEach((column, index) => {
                const th = document.createElement('th');
                th.innerHTML = column;
                headerRow.appendChild(th);
            });
        
            data.forEach((row, rowIndex) => {
                const newRow = coordinatesTable.insertRow(rowIndex + 1);
                [0, 2, 3, 4].forEach(cellIndex => { // Skipping the second column (index 1)
                    const cellElement = newRow.insertCell();
                    cellElement.innerHTML = row[cellIndex];
                });
            });
        
            // Hide the map section
            document.getElementById('map').style.display = 'none';
            // Show the coordinates section
            document.getElementById('coordinates').style.display = 'block';
        }
        
        

        function toggleSection(section) {
            if (section === 'map') {
                // Show the map section
                document.getElementById('map').style.display = 'block';
                // Hide the coordinates section
                document.getElementById('coordinates').style.display = 'none';
                // Fetch data and update map immediately
                fetchDataAndUpdateMap();
                // Fetch data and update map every 3 seconds
                setInterval(fetchDataAndUpdateMap, 5000);
            } else if (section === 'coordinates') {
                // Stop fetching and updating map
                clearInterval();
                // Show the coordinates section
                document.getElementById('coordinates').style.display = 'block';
                // Hide the map section
                document.getElementById('map').style.display = 'none';
                // Fetch and display coordinates immediately
                displayCoordinates();
            }
        }