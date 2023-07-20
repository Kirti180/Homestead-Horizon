function fetchProperties() {
    fetch('http://localhost:5000/properties')
      .then((response) => response.json())
      .then((data) => {
        const propertiesContainer = document.querySelector('.properties-container');
        propertiesContainer.innerHTML = ''; // Clear existing content
  
        data.forEach((property) => {
          const propertyCard = document.createElement('div');
          propertyCard.classList.add('property-card');
  
          const propertyImage = document.createElement('img');
          propertyImage.src = property.image_url;
          propertyCard.appendChild(propertyImage);
  
          const propertyName = document.createElement('h3');
          propertyName.textContent = property.property_name;
          propertyCard.appendChild(propertyName);
  
          const propertyType = document.createElement('p');
          propertyType.textContent = 'Type: ' + property.property_type;
          propertyCard.appendChild(propertyType);
  
          const propertyPrice = document.createElement('p');
          propertyPrice.textContent = 'Price: $' + property.property_price;
          propertyCard.appendChild(propertyPrice);
  
          const propertyLocation = document.createElement('p');
          propertyLocation.textContent = 'Location: ' + property.location;
          propertyCard.appendChild(propertyLocation);
  
          propertiesContainer.appendChild(propertyCard);
        });
      })
      .catch((error) => console.error('Error:', error));
  }
  
  // Call the function to fetch and display properties when the page loads
  fetchProperties();
  

  function openModal() {
    const modal = document.getElementById('hostModal');
    modal.style.display = 'block';
  }
  
  function closeModal() {
    const modal = document.getElementById('hostModal');
    modal.style.display = 'none';
  }
  
  // Add an event listener to the "Host" link in the navbar
  document.querySelector('.nav-links li:nth-child(3) a').addEventListener('click', openModal);
  

  function loginHost() {
    const hostEmail = document.getElementById('hostEmail').value;
    const hostPassword = document.getElementById('hostPassword').value;
  
    const loginData = {
      host_email: hostEmail,
      host_password: hostPassword
    };
  
    fetch('http://localhost:5000/hosts/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Host login successful!") {
        // Login successful, redirect to the property.html page or any other page
        localStorage.setItem('hostId', data.host_id);
        window.location.href = './property.html'; // Replace with the desired page URL
      } else {
        alert(data.message); // Show an error message if login fails
      }
    })
    .catch((error) => console.error('Error:', error));
  }
  