// Function to handle deleting a property
function handleDeleteProperty(propertyId) {
    // Fetch the property details based on propertyId
    fetch(`http://127.0.0.1:5000/properties/${propertyId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        // Check if the response status is 204 (No Content), which indicates a successful delete
        if (response.status === 204) {
          // Property deleted successfully, refresh the property list
          showProperties();
        } else {
          // If the response status is not 204, try parsing the JSON response
          return response.json();
        }
      })
      .then((data) => {
        // Check if data exists and contains an error message
        if (data && data.message) {
          // If there's an issue with the delete, display the error message
          const errorContainer = document.getElementById('errorContainer');
          errorContainer.innerText = `Error deleting property: ${data.message}`;
        } else {
          // If data is empty or doesn't contain an error message, handle it accordingly
          const errorContainer = document.getElementById('errorContainer');
          errorContainer.innerText = 'Error deleting property. Please try again later.';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // If there's an error with the fetch request, display an error message
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerText = 'Error deleting property. Please try again later.';
      });
  }


// Function to handle editing property details



function handleEditProperty(propertyId) {
    // Fetch the property details based on propertyId
    fetch(`http://127.0.0.1:5000/properties/${propertyId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        // Pre-fill the edit modal with the property details
        const editModal = document.getElementById('editModal');
        const editForm = editModal.querySelector('form');
        const propertyIdInput = editForm.querySelector('#propertyId');
        const propertyNameInput = editForm.querySelector('#propertyName');
        const propertyTypeInput = editForm.querySelector('#propertyType');
        const propertyPriceInput = editForm.querySelector('#propertyPrice');
        const imageUrlInput = editForm.querySelector('#imageUrl');
        const locationInput = editForm.querySelector('#location');
  
        propertyIdInput.value = data.property_id;
        propertyNameInput.value = data.property_name;
        propertyTypeInput.value = data.property_type;
        propertyPriceInput.value = data.property_price;
        imageUrlInput.value = data.image_url;
        locationInput.value = data.location;
  
        // Remove existing event listener (if any) from the "Save Edit" button
        const saveEditBtn = document.getElementById('saveEditBtn');
        saveEditBtn.removeEventListener('click', handleSaveEdit);
  
        // Add new event listener to the "Save Edit" button
        saveEditBtn.addEventListener('click', () => handleSaveEdit(propertyId));
    
        // Display the edit modal
        editModal.style.display = 'block';
      })
      .catch((error) => {
        console.error('Error:', error);
        // If there's an error fetching property details, display an error message in the console or handle it accordingly
      });
  }
  
  // Function to handle saving the edited property details
  function handleSaveEdit(propertyId) {
    // Get the form data from the edit modal
    const editForm = document.getElementById('editForm');
    const formData = new FormData(editForm);
  
    // Get the host ID from localStorage
    const hostId = localStorage.getItem('hostId');
  
    // If hostId is not available, display an error message and return
    if (!hostId) {
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.innerText = 'Error: Host ID not available.';
      return;
    }
  
    // Set the default host ID in the formData
    formData.set('host_id', hostId);
  
    // Send a fetch request to update the property
    fetch(`http://127.0.0.1:5000/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    })
      .then((response) => {
        // Check if the response status is 204 (No Content), which indicates a successful update
        if (response.status === 204) {
          // Property updated successfully, close the edit modal and refresh the property list
          closeModal();
          showProperties();
        } else {
          // If the response status is not 204, try parsing the JSON response
          return response.json();
        }
      })
      .then((data) => {
        // Check if data exists and contains an error message
        if (data && data.message) {
          // If there's an issue with the update, display the error message
          const errorContainer = document.getElementById('errorContainer');
          errorContainer.innerText = `Error updating property: ${data.message}`;
        } else {
          // If data is empty or doesn't contain an error message, handle it accordingly
          const errorContainer = document.getElementById('errorContainer');
          errorContainer.innerText = 'Error updating property. Please try again later.';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // If there's an error with the fetch request, display an error message
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerText = 'Error updating property. Please try again later.';
      });
  }
  
  // Function to close the modal
  function closeModal() {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
      modals[i].style.display = 'none';
    }
  }
  
  // Add event listener to the "Save Edit" button inside the edit modal
  const saveEditBtn = document.getElementById('saveEditBtn');
  saveEditBtn.addEventListener('click', handleSaveEdit);
  
  // Add event listener to the "Edit" and "Delete" buttons for each property card
  function addEventListenersToPropertyCards(data) {
    const propertyContainer = document.getElementById('propertyContainer');
    propertyContainer.innerHTML = ''; // Clear existing content
  
    if (data && Array.isArray(data) && data.length > 0) {
      data.forEach((property) => {
        const card = document.createElement('div');
        card.classList.add('property-card');
  
        // Display property information in the card, including the image, edit, and delete buttons
        card.innerHTML = `
          <img src="${property.image_url}" alt="Property Image"> 
          <h2>${property.property_name}</h2>
          <p>Property Type: ${property.property_type}</p>
          <p>Price: ${property.property_price}</p>
          <p>Location: ${property.location}</p>
          <button class="edit-btn" data-id="${property.property_id}">Edit</button>
          <button class="delete-btn" data-id="${property.property_id}">Delete</button>
          <!-- Add other property details as needed -->
        `;
  
        // Append the card to the property container
        propertyContainer.appendChild(card);
  
        // Add event listeners to the "Edit" and "Delete" buttons
        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => handleEditProperty(property.property_id));
  
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => handleDeleteProperty(property.property_id));
      });
    } else {
      // If no properties are available, display a message
      const noPropertiesMessage = document.createElement('p');
      noPropertiesMessage.innerText = 'No properties available.';
      propertyContainer.appendChild(noPropertiesMessage);
    }
  }
  
  // Function to fetch and display properties belonging to the logged-in host
  function showProperties() {
    // Get the host ID from localStorage
    const hostId = localStorage.getItem('hostId');
  
    if (!hostId) {
      // If the host ID is not available, redirect to the login page or handle it accordingly
      window.location.href = 'login.html'; // Replace with the login page URL
      return;
    }
  
    // Fetch properties belonging to the logged-in host using the host ID
    fetch(`http://127.0.0.1:5000/hosts/${hostId}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the response data to check its structure
        addEventListenersToPropertyCards(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        // If there's an error fetching properties, display an error message
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerText = 'Error fetching properties. Please try again later.';
      });
  }
  
  // Add event listeners to the "Close" buttons (X) inside modals
  const closeButtons = document.getElementsByClassName('close');
  for (let i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', closeModal);
  }
  
  // Add event listener to close the modal when clicking outside the modal content
  window.addEventListener('click', (event) => {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
      if (event.target === modals[i]) {
        modals[i].style.display = 'none';
      }
    }
  });


  
  // ... (rest of the JavaScript code remains unchanged)

  // Call the 'showProperties' function when the property.html page loads
  window.addEventListener('load', showProperties);
