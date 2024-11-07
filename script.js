document.addEventListener('DOMContentLoaded', function() {
    showWelcomeMessage();
});

document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('userId');
    const deviceToken = localStorage.getItem('deviceToken');
    storeDeviceToken(userId)
});


function storeDeviceToken(userId) {
    const token = localStorage.getItem('deviceToken') || generateDeviceToken();
    localStorage.setItem('deviceToken', token);

    fetch('/save-device-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, token })
    })
}

function generateDeviceToken() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function showWelcomeMessage() {
    Swal.fire({
        title: '<h2 style="color: #ffffff; font-size: 22px; margin-bottom: 10px;">Welcome to the Test Website</h2>',
        html: `
            <p style="color: #b3b3b3; font-size: 14px; margin-bottom: 20px;">
                This is a test website. All functions are available without authentication.
            </p>
        `,
        background: '#1f1f1f',
        color: '#ffffff',
        confirmButtonColor: '#007bff',
        confirmButtonText: 'Continue',
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector('.container').style.display = 'block';
        }
    });
}

document.getElementById('sendBtn').addEventListener('click', function() {
    var platform = document.getElementById('platform').value;
    var profileUrl = document.getElementById('profileUrl').value.trim();
    
    if (!profileUrl) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid URL',
            text: 'Please enter a profile URL.',
            background: '#1f1f1f',
            color: '#ffffff',
            confirmButtonColor: '#007bff'
        });
        return;
    }

    var urlRegex;
    if (platform === 'instagram') {
        urlRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?$/;
    } else if (platform === 'facebook') {
        urlRegex = /^(https?:\/\/)?(www\.)?(m\.|web\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/;
    }

    if (!urlRegex.test(profileUrl)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid URL',
            text: 'Please enter a valid ' + platform + ' profile URL.',
            background: '#1f1f1f',
            color: '#ffffff',
            confirmButtonColor: '#007bff'
        });
        return;
    }

    sendReports(profileUrl);
});

function sendReports(profileUrl) {
    var totalReports = document.getElementById('totalReports');
    var target = Math.floor(Math.random() * (2096 - 1000 + 1)) + 1000;
    var duration = Math.floor(Math.random() * (60 - 36 + 1)) + 36;
    var data = [];
    var steps = target;
    var interval = duration * 1000 / steps;

    var chartDiv = document.getElementById('chart');
    chartDiv.innerHTML = '';

    var width = chartDiv.clientWidth;
    var height = chartDiv.clientHeight;

    var svg = d3.select(chartDiv)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var tooltip = document.querySelector('.tooltip');

    var xScale = d3.scaleLinear().domain([0, steps - 1]).range([50, width - 50]);
    var yScale = d3.scaleLinear().domain([0, target]).range([height - 50, 50]);

    function generateData() {
        var value = 0;
        for (var i = 0; i < steps; i++) {
            var change = Math.floor(Math.random() * 100) - 50;
            value += change;
            if (value < 0) value = 0;
            if (value > target) value = target;
            data.push({ x: i, y: value });
        }
        data[steps - 1].y = target;
    }

    generateData();

    var grid = svg.append('g')
        .attr('class', 'grid');

    grid.append('g')
        .attr('transform', 'translate(0,' + (height - 50) + ')')
        .call(d3.axisBottom(xScale).ticks(10).tickSize(-height + 100).tickFormat(''))
        .attr('stroke', '#444');

    grid.append('g')
        .attr('transform', 'translate(50,0)')
        .call(d3.axisLeft(yScale).ticks(10).tickSize(-width + 100).tickFormat(''))
        .attr('stroke', '#444');

    var line = d3.line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); })
        .curve(d3.curveMonotoneX);

    var path = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('d', line)
        .attr('stroke-dasharray', function() { return this.getTotalLength(); })
        .attr('stroke-dashoffset', function() { return this.getTotalLength(); });

    path.transition()
        .duration(duration * 1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);

    var totalSent = 0;
    var circles = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function(d) { return xScale(d.x); })
        .attr('cy', function(d) { return yScale(0); })
        .attr('r', 5)
        .attr('fill', '#00d4ff')
        .style('opacity', 0);

    circles.transition()
        .delay(function(d, i) { return (i / steps) * duration * 1000; })
        .duration(500)
        .attr('cy', function(d) { return yScale(d.y); })
        .style('opacity', 1)
        .on('end', function(d, i) {
            totalSent += d.y;
            totalReports.textContent = 'Total reports sent: ' + totalSent;
        });

    circles.on('click', function(event, d) {
        var isLastPoint = d.x === steps - 1;
        var statusMessage = isLastPoint
            ? '<div class="status suspended"><span class="dot"></span>Account suspended successfully</div>'
            : '<div class="status active"><span class="dot"></span>Account is active</div>';

        tooltip.innerHTML = 'Report sent successfully: ' + d.y + statusMessage;
        tooltip.style.left = (event.pageX + 10) + 'px';
        tooltip.style.top = (event.pageY - 20) + 'px';
        tooltip.style.display = 'block';
    });

    circles.on('mouseout', function() {
        tooltip.style.display = 'none';
    });
}
