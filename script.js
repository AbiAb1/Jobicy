document.addEventListener("DOMContentLoaded", function() {
    const jobListingsContainer = document.getElementById('job-listings');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function fetchJobs(apiUrl) {
        // Clear previous listings
        jobListingsContainer.innerHTML = '';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('API Response:', data); // Log the fetched data

                // Check if data.jobs exists and is an array
                if (!data.jobs || !Array.isArray(data.jobs)) {
                    throw new Error('API response does not contain an array of jobs.');
                }

                if (data.jobs.length === 0) {
                    jobListingsContainer.innerHTML = '<p>No job listings found.</p>';
                    return;
                }

                // Iterate through each job and create HTML elements
                data.jobs.forEach(job => {
                    const jobElement = document.createElement('div');
                    jobElement.classList.add('job');

                    const companyLogoUrl = job.companyLogoUrl || 'https://via.placeholder.com/100x60?text=No+Logo';

                    jobElement.innerHTML = `
                        <div class="job-details">
                            <h2><a href="${job.url}" target="_blank">${job.jobTitle}</a></h2>
                            <p><strong>Company:</strong> ${job.companyName}</p>
                            <p><strong>Industry:</strong> ${job.jobIndustry}</p>
                            <p><strong>Type:</strong> ${job.jobType}</p>
                            <p><strong>Location:</strong> ${job.jobGeo}</p>
                            <p>${job.jobExcerpt}</p>
                        </div>
                        <div class="company-logo">
                            <img src="${companyLogoUrl}" alt="${job.companyName} Logo">
                        </div>
                    `;

                    jobListingsContainer.appendChild(jobElement);
                });
            })
            .catch(error => {
                console.error('Error fetching job listings:', error);
                jobListingsContainer.innerHTML = `<p>Error fetching job listings: ${error.message}</p>`;
            });
    }

    // Function to build API URL with search term
    function buildApiUrl(searchTerm) {
        let apiUrl = 'https://jobicy.com/api/v2/remote-jobs';
        if (searchTerm !== '') {
            apiUrl += `?tag=${encodeURIComponent(searchTerm)}`;
        }
        return apiUrl;
    }

    // Function to handle search
    function handleSearch() {
        const searchTerm = searchInput.value.trim();
        fetchJobs(buildApiUrl(searchTerm));
    }

    // Event listener for search button click
    searchButton.addEventListener('click', handleSearch);

    // Event listener for pressing Enter in search input
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Initial fetch on page load (optional)
    fetchJobs(buildApiUrl(''));
});
