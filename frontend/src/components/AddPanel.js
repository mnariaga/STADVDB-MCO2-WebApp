import React, { useState } from 'react';
import '../styles/AddPage.css'; 
const AddPanel = () => {
  const [formData, setFormData] = useState({
    field1: '', // Name
    field2: '', // Release Date
    field3: '', // Release Year
    field4: '', // Price
    field5: '', // Positive Reviews
    field6: '', // Negative Reviews
    field7: '', // User Score
    field8: '', // Metacritic Score
    field9: '', // Average Playtime Forever
    field10: '', // Average Playtime 2 Weeks
    field11: '', // Median Playtime Forever
  });

  const labels = [
    'Name',
    'Release Date',
    'Release Year',
    'Price',
    'Positive Reviews',
    'Negative Reviews',
    'User Score',
    'Metacritic Score',
    'Average Playtime Forever',
    'Average Playtime 2 Weeks',
    'Median Playtime Forever',
  ];

  // Define the type of input for each field
  const inputTypes = {
    field1: 'text', // Name
    field2: 'date', // Release Date
    field3: 'number', // Release Year
    field4: 'number', // Price
    field5: 'number', // Positive Reviews
    field6: 'number', // Negative Reviews
    field7: 'number', // User Score
    field8: 'number', // Metacritic Score
    field9: 'number', // Average Playtime Forever
    field10: 'number', // Average Playtime 2 Weeks
    field11: 'number', // Median Playtime Forever
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://stadvdb-mco2-g11.onrender.com/add-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      if (response.ok) {
        alert('Record added successfully!');
        setFormData({
          field1: '',
          field2: '',
          field3: '',
          field4: '',
          field5: '',
          field6: '',
          field7: '',
          field8: '',
          field9: '',
          field10: '',
          field11: '',
        });
      } else {
        alert('Failed to add record.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

 return (
  <div className="container-fluid">
    <div className="mx-auto" style={{ width: '1200px' }}>
      <h2 className="mb-4 text-center">Add Record</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field, index) => (
          <div className="mb-3 row" key={field}>
            <label
              htmlFor={field}
              className="col-sm-3 col-form-label text-end"
            >
              {labels[index]}:
            </label>
            <div className="col-sm-9">
              <input
                type={inputTypes[field]}
                className="form-control"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${labels[index]}`}
              />
            </div>
          </div>
        ))}
        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default AddPanel;
