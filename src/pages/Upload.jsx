// import { useState, useEffect, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom"; // Navigation ke liye
// import axios from "axios";
// import Webcam from "react-webcam";
// import "./style.css";

// // Dynamic API URL: Localhost pe hai toh local, varna Render ka link
// const API_URL = window.location.hostname === "localhost" 
//   ? "http://localhost:5000" 
//   : "https://fuelai-backend.onrender.com";

// export default function Upload() {
//   const navigate = useNavigate(); // Hook for navigation
//   const [files, setFiles] = useState({});
//   const [previews, setPreviews] = useState({});
//   const [location, setLocation] = useState(null);
//   const [userId, setUserId] = useState("");
//   const [activeCamera, setActiveCamera] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const webcamRef = useRef(null);

//   // Get Location on Mount
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(async (pos) => {
//       const { latitude: lat, longitude: lon } = pos.coords;
//       try {
//         const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
//         const data = await res.json();
//         setLocation({ lat, lon, address: data.display_name });
//       } catch (err) {
//         console.error("Location lookup failed", err);
//       }
//     });
//   }, []);

//   // Handle File Input
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const name = e.target.name;
//     if (file) {
//       setFiles((prev) => ({ ...prev, [name]: file }));
//       setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
//     }
//   };

//   // Capture from Webcam
//   const capture = useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     fetch(imageSrc)
//       .then((res) => res.blob())
//       .then((blob) => {
//         const file = new File([blob], `${activeCamera}.jpg`, { type: "image/jpeg" });
//         setFiles((prev) => ({ ...prev, [activeCamera]: file }));
//         setPreviews((prev) => ({ ...prev, [activeCamera]: imageSrc }));
//         setActiveCamera(null);
//       });
//   }, [webcamRef, activeCamera]);

//   const handleUpload = async () => {
//     setLoading(true);
//     const formData = new FormData();
//     Object.keys(files).forEach((key) => formData.append(key, files[key]));
//     formData.append("location", JSON.stringify(location));
//     formData.append("uploadTime", new Date().toISOString());

//     try {
//       // API_URL variable use ho raha hai yahan
//       const res = await axios.post(`${API_URL}/upload`, formData);
//       setUserId(res.data.userId);
//       alert("Upload Successful!");
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed. Check console.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const uploadFields = ["bill", "before", "after", "pump"];

//   return (
//     <div className="upload-container">
//       {/* --- QUICK NAVIGATION BUTTONS --- */}
//       <div className="nav-header">
//         <button className="nav-btn admin-btn" onClick={() => navigate("/admin")}>
//           🛡️ Admin Panel
//         </button>
//         <button className="nav-btn check-btn" onClick={() => navigate("/check")}>
//           🔍 Check Status
//         </button>
//       </div>

//       <div className="card">
//         <header className="card-header">
//           <h2>Asset Verification</h2>
//           <p className="subtitle">Upload or capture the required images</p>
//         </header>

//         <div className="upload-grid">
//           {uploadFields.map((field) => (
//             <div key={field} className="upload-box">
//               <label className="field-label">{field.toUpperCase()}</label>
              
//               <div className="preview-area">
//                 {previews[field] ? (
//                   <img src={previews[field]} alt={field} className="preview-img" />
//                 ) : (
//                   <div className="placeholder">No image selected</div>
//                 )}
//               </div>

//               <div className="button-group">
//                 <input
//                   type="file"
//                   name={field}
//                   id={`file-${field}`}
//                   hidden
//                   onChange={handleFileChange}
//                 />
//                 <label htmlFor={`file-${field}`} className="btn btn-secondary">Upload</label>
//                 <button 
//                   className="btn btn-primary" 
//                   onClick={() => setActiveCamera(field)}
//                 >
//                   📷 Camera
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Webcam Modal */}
//         {activeCamera && (
//           <div className="webcam-modal">
//             <div className="modal-content">
//               <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width="100%" />
//               <div className="modal-actions">
//                 <button className="btn btn-success" onClick={capture}>Capture</button>
//                 <button className="btn btn-danger" onClick={() => setActiveCamera(null)}>Cancel</button>
//               </div>
//             </div>
//           </div>
//         )}

//         <footer className="card-footer">
//           {location && <p className="location-tag">📍 {location.address}</p>}
//           <button 
//             className={`btn-submit ${loading ? 'loading' : ''}`} 
//             onClick={handleUpload}
//             disabled={Object.keys(files).length < 4 || loading}
//           >
//             {loading ? "Processing..." : "Submit All Records"}
//           </button>
//           {userId && (
//             <div className="success-section">
//               <div className="success-badge">Ref ID: {userId}</div>
//               <p className="hint-text">Use this ID in 'Check Status' to track your invoice.</p>
//             </div>
//           )}
//         </footer>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import { API_BASE_URL } from "../apiConfig"; // Centralized API URL import kiya

export default function Upload() {
  const navigate = useNavigate();
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
      // UPDATE: API_BASE_URL use kiya taaki live aur local dono chale
      const res = await axios.post(`${API_BASE_URL}/upload`, formData);
      setUserId(res.data.userId);
      alert("✅ Upload Successful!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFields = ["bill", "before", "after", "pump"];

  return (
    <div className="upload-page-wrapper">
      <style>{`
        .upload-page-wrapper {
          background: #0f172a;
          min-height: 100vh;
          color: white;
          padding: 20px;
          font-family: 'Rajdhani', sans-serif;
        }
        .nav-header {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          justify-content: center;
        }
        .nav-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }
        .admin-btn { background: #7000ff; color: white; }
        .check-btn { background: #00f2ff; color: #000; }
        
        .card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
        }
        .upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 25px 0;
        }
        .upload-box {
          background: rgba(0,0,0,0.3);
          padding: 15px;
          border-radius: 15px;
          text-align: center;
          border: 1px solid rgba(0, 242, 255, 0.2);
        }
        .preview-area {
          height: 150px;
          background: #000;
          margin: 10px 0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .preview-img { width: 100%; height: 100%; object-fit: cover; }
        .btn-group { display: flex; gap: 5px; justify-content: center; }
        .btn { padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8rem; }
        .btn-primary { background: #00f2ff; color: #000; }
        .btn-secondary { background: #334155; color: white; }
        
        .btn-submit {
          width: 100%;
          padding: 15px;
          background: linear-gradient(90deg, #00f2ff, #7000ff);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
        }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .webcam-modal {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content { width: 90%; max-width: 500px; text-align: center; }
        .success-badge {
          background: #059669;
          padding: 10px;
          border-radius: 8px;
          margin-top: 15px;
          font-family: monospace;
        }
      `}</style>

      <div className="nav-header">
        <button className="nav-btn admin-btn" onClick={() => navigate("/admin")}>🛡️ Admin Panel</button>
        <button className="nav-btn check-btn" onClick={() => navigate("/check")}>🔍 Check Status</button>
      </div>

      <div className="card">
        <header className="card-header">
          <h2 style={{ color: '#00f2ff' }}>Asset Verification</h2>
          <p style={{ color: '#94a3b8' }}>Upload or capture all 4 required images</p>
        </header>

        <div className="upload-grid">
          {uploadFields.map((field) => (
            <div key={field} className="upload-box">
              <label style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{field.toUpperCase()}</label>
              <div className="preview-area">
                {previews[field] ? (
                  <img src={previews[field]} alt={field} className="preview-img" />
                ) : (
                  <div style={{ color: '#475569', fontSize: '0.8rem' }}>No Image</div>
                )}
              </div>
              <div className="btn-group">
                <input type="file" name={field} id={`file-${field}`} hidden onChange={handleFileChange} />
                <label htmlFor={`file-${field}`} className="btn btn-secondary">Upload</label>
                <button className="btn btn-primary" onClick={() => setActiveCamera(field)}>📷 Camera</button>
              </div>
            </div>
          ))}
        </div>

        {activeCamera && (
          <div className="webcam-modal">
            <div className="modal-content">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width="100%" />
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="nav-btn" style={{ background: '#10b981' }} onClick={capture}>Capture</button>
                <button className="nav-btn" style={{ background: '#ef4444' }} onClick={() => setActiveCamera(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <footer className="card-footer">
          {location && <p style={{ fontSize: '0.8rem', color: '#00f2ff' }}>📍 {location.address}</p>}
          <button 
            className="btn-submit" 
            onClick={handleUpload}
            disabled={Object.keys(files).length < 4 || loading}
          >
            {loading ? "⚡ Processing..." : "🚀 Submit All Records"}
          </button>
          
          {userId && (
            <div className="success-section">
              <div className="success-badge">Ref ID: {userId}</div>
              <p style={{ fontSize: '0.75rem', marginTop: '5px', color: '#94a3b8' }}>Save this ID to check your verification status later.</p>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}