import { useState } from "react";
import "./App.css";


function App() {
  const [formData, setFormData] = useState({
    rawText: "",
    platforms: [],
  });

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handlePlatformChange = (e) => {
    const { checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      platforms: checked
        ? [...prev.platforms, value]
        : prev.platforms.filter((p) => p !== value),
    }));
  };

  const handleTextChange = (e) => {
    setFormData((prev) => ({ ...prev, rawText: e.target.value }));
  };

  const ContactGemini = async () => {
    if (!formData.rawText.trim() || formData.platforms.length === 0) {
      alert("⚠️ Please enter text and select at least one platform!");
      return;
    }

    setLoading(true);
    setOutput(""); // Clear previous output

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": "AIzaSyD9BNGvZSSlFMw78LtQNoMmGbjTCArP_qA",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate social media posts based on this raw text: "${formData.rawText}" for the following platforms: ${formData.platforms.join(
                  ", "
                )}. 
                Each post should follow this structure:
                platform name: [platformName]
                post: [post content]`,
              },
            ],
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response found.";

      setOutput(geminiText);
    } catch (error) {
      console.error("Error contacting Gemini:", error);
      setOutput("❌ Failed to contact Gemini. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="app-container">
        <form className="form-box">
          <h2 className="form-title">✨ Generate About Social Media Posts</h2>

          <label htmlFor="rawText" className="label">
            Enter Raw Text
          </label>
          <textarea
            id="rawText"
            rows={8}
            value={formData.rawText}
            onChange={handleTextChange}
            placeholder="Type your content idea here..."
            className="textarea"
          />

          <h3 className="label">Select Platforms</h3>
          <div className="checkbox-group">
            {["LinkedIn", "Instagram", "Twitter"].map((platform) => (
              <label key={platform} className="checkbox-item">
                <input
                  type="checkbox"
                  value={platform.toLowerCase()}
                  onChange={handlePlatformChange}
                />
                {platform}
              </label>
            ))}
          </div>

          <div className="button-group">
           
            <button
              type="button"
              className="btn primary-btn"
              onClick={ContactGemini}
              disabled={loading}
            >
              {loading ? "⏳ Generating..." : "🚀 Contact Gemini"}
            </button>
          </div>
        </form>

        {/* --- OUTPUT SECTION --- */}
        <div className="output-box">
          <h2 className="output-title">🪄 Generated Posts</h2>
          {loading ? (
            <p className="loading-text">Generating your posts... please wait.</p>
          ) : output ? (
            <div
              className="output-content"
              dangerouslySetInnerHTML={{ __html: output.replace(/\n/g, "<br/>") }}
            ></div>
          ) : (
            <p className="placeholder-text">Your generated posts will appear here...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
