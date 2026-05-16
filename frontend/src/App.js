import React, { useState } from 'react';
import axios from 'axios';

function App() {

  const [excelFile, setExcelFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const handleSubmit = async () => {

    if (!excelFile || !resumeFile) {
      alert("Please upload both files");
      return;
    }

    if (!subject || !message) {
      alert("Please enter subject and email message");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append('excel', excelFile);
    formData.append('resume', resumeFile);
    formData.append('subject', subject);
    formData.append('message', message);

    try {

      const response = await axios.post(
        'http://localhost:8000/api/send-emails/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log(response.data);

      setResult(response.data);

      alert("Emails processed successfully");

    } catch (error) {

      console.error(error);

      alert("Error sending emails");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #dbeafe, #ffffff)',
        padding: '40px',
        fontFamily: 'Arial'
      }}
    >

      <div
        style={{
          maxWidth: '1000px',
          margin: 'auto',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0px 0px 20px rgba(0,0,0,0.1)'
        }}
      >

        <h1
          style={{
            textAlign: 'center',
            marginBottom: '10px',
            color: '#1e3a8a'
          }}
        >
          Bulk HR Mailer
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: 'gray',
            marginBottom: '40px'
          }}
        >
          Upload your Excel sheet and Resume to send bulk emails automatically
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px'
          }}
        >

          <div
            style={{
              backgroundColor: '#eff6ff',
              padding: '25px',
              borderRadius: '15px'
            }}
          >

            <h3 style={{ color: '#2563eb' }}>
              Upload Excel File
            </h3>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setExcelFile(e.target.files[0])}
              style={{ marginTop: '15px' }}
            />

          </div>

          <div
            style={{
              backgroundColor: '#eef2ff',
              padding: '25px',
              borderRadius: '15px'
            }}
          >

            <h3 style={{ color: '#4f46e5' }}>
              Upload Resume
            </h3>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              style={{ marginTop: '15px' }}
            />

          </div>

        </div>

        <div
          style={{
            marginTop: '30px'
          }}
        >

          <h3>Email Subject</h3>

          <input
            type="text"
            placeholder="Enter email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />

        </div>

        <div
          style={{
            marginTop: '30px'
          }}
        >

          <h3>Email Message</h3>

          <textarea
            placeholder="Enter email message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="10"
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              fontSize: '16px',
              resize: 'none'
            }}
          />

        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '15px 40px',
              backgroundColor: loading ? 'gray' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >

            {
              loading
                ? 'Sending Emails...'
                : 'Send Emails'
            }

          </button>

        </div>

        {
          result && (

            <div style={{ marginTop: '50px' }}>

              <h2
                style={{
                  textAlign: 'center',
                  marginBottom: '30px'
                }}
              >
                Results
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '30px'
                }}
              >

                <div
                  style={{
                    backgroundColor: '#ecfdf5',
                    padding: '20px',
                    borderRadius: '15px'
                  }}
                >

                  <h3 style={{ color: 'green' }}>
                    Successful Emails
                  </h3>

                  <p>
                    <strong>Count:</strong> {result.success_count}
                  </p>

                  <ul>

                    {
                      result.success_emails.map((email, index) => (
                        <li key={index}>{email}</li>
                      ))
                    }

                  </ul>

                </div>

                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    padding: '20px',
                    borderRadius: '15px'
                  }}
                >

                  <h3 style={{ color: 'red' }}>
                    Failed Emails
                  </h3>

                  <p>
                    <strong>Count:</strong> {result.failed_count}
                  </p>

                  <ul>

                    {
                      result.failed_emails.map((email, index) => (
                        <li key={index}>{email}</li>
                      ))
                    }

                  </ul>

                </div>

              </div>

            </div>

          )
        }

      </div>

    </div>
  );
}

export default App;