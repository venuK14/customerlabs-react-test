import { useState } from 'react';
import './App.css'
import axios from 'axios';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [addedSchemas, setAddedSchemas] = useState([]);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });

  // Schema options with labels and values
  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' }
  ];

  // Get available options (not yet selected)
  const getAvailableOptions = () => {
    const selectedValues = addedSchemas.map(schema => schema.value);
    return schemaOptions.filter(option => !selectedValues.includes(option.value));
  };

  const showSnackbar = (message, type = 'success') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleAddSchema = () => {
    if (selectedSchema) {
      const schemaToAdd = schemaOptions.find(option => option.value === selectedSchema);
      if (schemaToAdd) {
        setAddedSchemas([...addedSchemas, schemaToAdd]);
        setSelectedSchema(''); // Reset dropdown
        // No success message here - only show when API is successful
      }
    } else {
      showSnackbar('Please select a schema from the "Add schema to segment" dropdown first', 'error');
    }
  };

  const handleRemoveSchema = (index) => {
    const newSchemas = addedSchemas.filter((_, i) => i !== index);
    setAddedSchemas(newSchemas);
  };

  const handleSave = async () => {
    if (!segmentName.trim()) {
      showSnackbar('Please enter a segment name in the text field above', 'error');
      return;
    }

    if (addedSchemas.length === 0) {
      showSnackbar('Please add at least one schema: Select from dropdown and click "+ Add new schema"', 'error');
      return;
    }

    const payload = {
      segment_name: segmentName,
      schema: addedSchemas.map(schema => ({
        [schema.value]: schema.label
      }))
    };
    try {
      const result = await axios.post('https://webhook.site/02cb5447-63d0-47be-a100-52577b486ca8', payload);
      
      // Check if the API call was successful
      if (result.status >= 200 && result.status < 300) {
        showSnackbar('Segment saved successfully!', 'success');
        
        // Reset form only on success
        setSegmentName('');
        setAddedSchemas([]);
        setSelectedSchema('');
        setShowModal(false);
      } else {
        showSnackbar('Error saving segment. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('Error saving segment. Please try again.', 'error');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSegmentName('');
    setAddedSchemas([]);
    setSelectedSchema('');
  };

  return (
    <div className='container'>
      <div className='button-container'>  
        <button className='save-segment-btn' onClick={() => setShowModal(true)}>
          Save segment
        </button>
      </div>
      
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <div className='modal-header'>
              <button className='back-btn' onClick={handleCancel}>←</button>
              <h2>Saving Segment</h2>
            </div>
            
            <div className='modal-content'>
              <div className='segment-name-section'>
                <label>Enter the Name of the Segment</label>
                <input 
                  type="text" 
                  placeholder="Name of the segment" 
                  value={segmentName} 
                  onChange={(e) => setSegmentName(e.target.value)} 
                />
              </div>

              <div className='instructions'>
                <p>To save your segment, you need to add the schemas to build the query.</p>
                <div className='legend'>
                  <span className='legend-item'>
                    <span className='dot user-trait'></span>User Traits
                  </span>
                  <span className='legend-item'>
                    <span className='dot group-trait'></span>Group Traits
                  </span>
                </div>
              </div>

              <div className='schema-section'>
                <div className='blue-box'>
                  {addedSchemas.length === 0 ? (
                    <div className='empty-state'>
                      <p>No schemas added yet. Select from dropdown below and click "+ Add new schema"</p>
                    </div>
                  ) : (
                    addedSchemas.map((schema, index) => (
                      <div key={index} className='schema-item'>
                        <span className='dot user-trait'></span>
                        <select 
                          value={schema.value}
                          onChange={(e) => {
                            const newSchema = schemaOptions.find(opt => opt.value === e.target.value);
                            if (newSchema) {
                              const updatedSchemas = [...addedSchemas];
                              updatedSchemas[index] = newSchema;
                              setAddedSchemas(updatedSchemas);
                            }
                          }}
                        >
                          {getAvailableOptions().map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button 
                          className='remove-btn'
                          onClick={() => handleRemoveSchema(index)}
                        >
                          −
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className='add-schema-section'>
                  <div className='schema-item'>
                    <span className='dot gray'></span>
                    <select 
                      value={selectedSchema}
                      onChange={(e) => setSelectedSchema(e.target.value)}
                    >
                      <option value="">Add schema to segment</option>
                      {getAvailableOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button className='remove-btn'>−</button>
                  </div>
                  <button 
                    className='add-schema-link'
                    onClick={handleAddSchema}
                    disabled={!selectedSchema}
                  >
                    + Add new schema
                  </button>
                </div>
              </div>
            </div>

            <div className='modal-footer'>
              <button className='cancel-btn' onClick={handleCancel}>
                Cancel
              </button>
              <button className='save-btn' onClick={handleSave}>
                Save the Segment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Snackbar */}
      {snackbar.show && (
        <div className={`snackbar ${snackbar.type}`}>
          <span className="snackbar-message">{snackbar.message}</span>
          <button 
            className="snackbar-close" 
            onClick={() => setSnackbar({ show: false, message: '', type: 'success' })}
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default App
