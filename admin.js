import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

let clientsData = [];
let serviceInterestChart = null; // Add this at the top

function renderTable(data) {
    const tbody = document.getElementById('client-data');
    tbody.innerHTML = "";
    data.forEach((client) => {
        const row = `<tr>
            <td>${client.clientId}</td>
            <td>${client.full_name}</td>
            <td>${client.phone_number}</td>
            <td>${client.email}</td>
            <td>${client.service_interest}</td>
            <td>${client.referral_source}</td>
            <td>${new Date(client.created_at.seconds * 1000).toLocaleString()}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function filterTable() {
    const nameFilter = document.getElementById('filter-name').value.toLowerCase();
    const phoneFilter = document.getElementById('filter-phone').value.toLowerCase();
    const emailFilter = document.getElementById('filter-email').value.toLowerCase();
    const interestFilter = document.getElementById('filter-interest').value.toLowerCase();

    const filteredData = clientsData.filter(client => {
        const nameMatch = client.full_name.toLowerCase().includes(nameFilter);
        const phoneMatch = client.phone_number.toLowerCase().includes(phoneFilter);
        const emailMatch = client.email.toLowerCase().includes(emailFilter);
        const interestMatch = client.service_interest.toLowerCase().includes(interestFilter);
        
        return nameMatch && phoneMatch && emailMatch && interestMatch;
    });

    renderTable(filteredData);
}

onAuthStateChanged(auth, user => {
    if (user) {
        const q = query(collection(db, "clients"), orderBy("clientId", "asc"));
        onSnapshot(q, (querySnapshot) => {
            clientsData = [];
            const serviceInterestCounts = {};
            
            querySnapshot.forEach((doc) => {
                const client = doc.data();
                if (client.clientId) {
                    clientsData.push(client);

                    if (serviceInterestCounts[client.service_interest]) {
                        serviceInterestCounts[client.service_interest]++;
                    } else {
                        serviceInterestCounts[client.service_interest] = 1;
                    }
                }
            });
            
            renderTable(clientsData);

            if (Object.keys(serviceInterestCounts).length > 0) {
                const ctx = document.getElementById('service-interest-chart').getContext('2d');
                // Destroy previous chart if it exists
                if (serviceInterestChart) {
                    serviceInterestChart.destroy();
                }
                serviceInterestChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(serviceInterestCounts),
                        datasets: [{
                            label: 'Service Interest',
                            data: Object.values(serviceInterestCounts),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Service Interest'
                            }
                        }
                    }
                });
            }
        });
    } else {
        window.location.href = 'login.html';
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Sign out error', error);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('filter-name').addEventListener('keyup', filterTable);
    document.getElementById('filter-phone').addEventListener('keyup', filterTable);
    document.getElementById('filter-email').addEventListener('keyup', filterTable);
    document.getElementById('filter-interest').addEventListener('keyup', filterTable);
});