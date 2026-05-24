import React, { useState } from "react";
import { Sparkles, Copy, Download, Github, Code2, CheckCircle, AlertTriangle } from "lucide-react";
import { createRoot } from "react-dom/client";
import "./style.css";

const sampleCode = `function findLargest(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}`;

function App() {
  const [apiKey, setApiKey] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(sampleCode);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateTestCases = async () => {
    if (!apiKey.trim()) {
      alert("Please paste your Gemini API key first.");
      return;
    }
    if (!code.trim()) {
      alert("Please paste your code.");
      return;
    }

    setLoading(true);
    setResult("");

    const prompt = `
You are an expert software testing assistant.

Generate professional test cases for the following ${language} code.

Give output in this format:
1. Short code understanding
2. Normal test cases with input and expected output
3. Edge test cases
4. Negative/invalid test cases
5. Unit test code
6. Testing summary

Make it clear, beginner-friendly, and useful for developers.

Code:
${code}
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.error?.message ||
        "No response generated. Please check API key.";
      setResult(text);
    } catch (error) {
      setResult("Error: Unable to connect to Gemini API. Please check internet/API key.");
    }

    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result || "");
    alert("Result copied!");
  };

  const downloadReport = () => {
    const blob = new Blob([result || "No result"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TestGenAI_Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <Sparkles size={28} />
          <span>TestGen AI</span>
        </div>
        <a className="github" href="https://github.com" target="_blank">
          <Github size={18} /> GitHub
        </a>
      </nav>

      <section className="hero">
        <div className="badge">AI Hackathon Project</div>
        <h1>AI Test Case Generation Agent</h1>
        <p>
          Generate normal, edge, invalid and unit test cases instantly using Gemini AI.
          Built for developers to reduce manual testing time.
        </p>
      </section>

      <section className="features">
        <div className="feature"><CheckCircle /> AI-powered test generation</div>
        <div className="feature"><CheckCircle /> Edge case detection</div>
        <div className="feature"><CheckCircle /> Unit test code output</div>
        <div className="feature"><CheckCircle /> Downloadable report</div>
      </section>

      <main className="grid">
        <div className="card">
          <h2><Code2 /> Input Code</h2>

          <label>Gemini API Key</label>
          <input
            type="password"
            placeholder="Paste Gemini API key here"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <label>Programming Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C</option>
            <option>C++</option>
          </select>

          <label>Paste Your Code</label>
          <textarea value={code} onChange={(e) => setCode(e.target.value)} />

          <button onClick={generateTestCases} disabled={loading}>
            {loading ? "AI Generating..." : "Generate Test Cases"}
          </button>

          <div className="note">
            <AlertTriangle size={16} />
            API key is used only in browser for demo purpose.
          </div>
        </div>

        <div className="card output">
          <div className="outputHeader">
            <h2><Sparkles /> AI Generated Result</h2>
            <div>
              <button className="small" onClick={copyResult}><Copy size={16} /> Copy</button>
              <button className="small" onClick={downloadReport}><Download size={16} /> Download</button>
            </div>
          </div>

          {loading && <div className="loader">Analyzing code and generating test cases...</div>}

          {!loading && !result && (
            <div className="empty">
              Paste your code and click Generate Test Cases.
            </div>
          )}

          {!loading && result && <pre>{result}</pre>}
        </div>
      </main>

      <section className="about">
        <h2>Why TestGen AI?</h2>
        <p>
          Developers spend a lot of time writing test cases manually.
          TestGen AI automates this process and improves productivity,
          testing coverage and code reliability.
        </p>
      </section>

      <footer>
        Built with React + Gemini AI for Hackathon Submission
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
