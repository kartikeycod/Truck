import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import axios from "axios";
import Webcam from "react-webcam";
import "./style.css";

// Dynamic API URL: Localhost pe hai toh local, varna Render ka link
const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://fuelai-backend.onrender.com";

export default function Upload() {
  const navigate = useNavigate(); // Hook for navigation
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [location, setLocation] = useState(null);
  const [userId, setUserId] = useState("");
  const [activeCamera, setActiveCamera] = useState(null);
  const [loading, setLoading] = useState(false);

  const webcamRef = useRef(null);

  // Get Location on Mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        setLocation({ lat, lon, address: data.display_name });
      } catch (err) {
        console.error("Location lookup failed", err);
      }
    });
  }, []);

  // Handle File Input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      setFiles((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  // Capture from Webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${activeCamera}.jpg`, { type: "image/jpeg" });
        setFiles((prev) => ({ ...prev, [activeCamera]: file }));
        setPreviews((prev) => ({ ...prev, [activeCamera]: imageSrc }));
        setActiveCamera(null);
      });
  }, [webcamRef, activeCamera]);

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(files).forEach((key) => formData.append(key, files[key]));
    formData.append("location", JSON.stringify(location));
    formData.append("uploadTime", new Date().toISOString());

    try {
      // API_URL variable use ho raha hai yahan
      const res = await axios.post(`${API_URL}/upload`, formData);
      setUserId(res.data.userId);
      alert("Upload Successful!");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFields = ["bill", "before", "after", "pump"];

  return (
    <div className="upload-container">
      {/* --- QUICK NAVIGATION BUTTONS --- */}
      <div className="nav-header">
        <button className="nav-btn admin-btn" onClick={() => navigate("/admin")}>
          🛡️ Admin Panel
        </button>
        <button className="nav-btn check-btn" onClick={() => navigate("/check")}>
          🔍 Check Status
        </button>
      </div>

      <div className="card">
        <header className="card-header">
          <h2>Asset Verification</h2>
          <p className="subtitle">Upload or capture the required images</p>
        </header>

        <div className="upload-grid">
          {uploadFields.map((field) => (
            <div key={field} className="upload-box">
              <label className="field-label">{field.toUpperCase()}</label>
              
              <div className="preview-area">
                {previews[field] ? (
                  <img src={previews[field]} alt={field} className="preview-img" />
                ) : (
                  <div className="placeholder">No image selected</div>
                )}
              </div>

              <div className="button-group">
                <input
                  type="file"
                  name={field}
                  id={`file-${field}`}
                  hidden
                  onChange={handleFileChange}
                />
                <label htmlFor={`file-${field}`} className="btn btn-secondary">Upload</label>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setActiveCamera(field)}
                >
                  📷 Camera
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Webcam Modal */}
        {activeCamera && (
          <div className="webcam-modal">
            <div className="modal-content">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width="100%" />
              <div className="modal-actions">
                <button className="btn btn-success" onClick={capture}>Capture</button>
                <button className="btn btn-danger" onClick={() => setActiveCamera(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <footer className="card-footer">
          {location && <p className="location-tag">📍 {location.address}</p>}
          <button 
            className={`btn-submit ${loading ? 'loading' : ''}`} 
            onClick={handleUpload}
            disabled={Object.keys(files).length < 4 || loading}
          >
            {loading ? "Processing..." : "Submit All Records"}
          </button>
          {userId && (
            <div className="success-section">
              <div className="success-badge">Ref ID: {userId}</div>
              <p className="hint-text">Use this ID in 'Check Status' to track your invoice.</p>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}