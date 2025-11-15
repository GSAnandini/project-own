import React, { useState } from 'react';
import { FileText, Download, Sparkles, Loader2, CheckCircle2, AlertCircle, Zap, RefreshCw, Brain, Rocket, Star, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';

export default function FlowchartGenerator() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const exampleText = `Project Management System
Planning Phase
    Requirements Gathering
        Stakeholder Interviews
        Document Review
        Competitive Analysis
    Resource Allocation
        Team Assignment
        Budget Planning
        Tool Selection
    Timeline Creation
        Milestone Definition
        Task Breakdown
        Dependency Mapping
Execution Phase
    Development
        Frontend Development
            UI Design
            Component Building
            State Management
        Backend Development
            API Design
            Database Schema
            Authentication
        Testing
            Unit Testing
            Integration Testing
            User Acceptance Testing
    Deployment
        Environment Setup
        CI/CD Pipeline
        Production Release
Monitoring Phase
    Performance Tracking
        Metrics Collection
        Analytics Dashboard
        Report Generation
    Maintenance
        Bug Fixes
        Feature Updates
        Security Patches`;

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate a flowchart');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
//       const response = await fetch('http://localhost:5000/generate', {
      await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          imageUrl: `http://localhost:5000${data.image_url}`,
          nodes: data.nodes,
          edges: data.edges,
          mermaid: data.mermaid,
        });
      } else {
        setError(data.error || 'Failed to generate flowchart');
      }
    } catch (err) {
      setError('Unable to connect to backend. Ensure Python server is running on http://localhost:5000');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (result?.imageUrl) {
      try {
        // Fetch the image from the server
        const response = await fetch(result.imageUrl);
        const blob = await response.blob();

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `flowchart_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download failed:', error);
        setError('Failed to download image. Please try right-clicking and saving the image.');
      }
    }
  };

  const loadExample = () => {
    setInputText(exampleText);
    setError('');
    setResult(null);
  };

  const clearAll = () => {
    setInputText('');
    setResult(null);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '-10rem',
          width: '20rem',
          height: '20rem',
          background: 'rgba(147, 51, 234, 0.3)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '10rem',
          right: '0',
          width: '20rem',
          height: '20rem',
          background: 'rgba(59, 130, 246, 0.3)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite 2s'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-10rem',
          left: '33%',
          width: '20rem',
          height: '20rem',
          background: 'rgba(236, 72, 153, 0.3)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'pulse 4s ease-in-out infinite 1s'
        }}></div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive text sizes */
        @media (max-width: 768px) {
          .main-title { font-size: 2rem !important; }
          .subtitle { font-size: 0.9rem !important; }
          .section-title { font-size: 1.2rem !important; }
          .btn-text { font-size: 1rem !important; }
          .stat-number { font-size: 2.5rem !important; }
          .feature-title { font-size: 1rem !important; }
        }

        /* Mobile responsive grid */
        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                position: 'relative',
                padding: '1rem',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
                borderRadius: '1.5rem',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                flexShrink: 0
              }}>
                <Brain style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
              </div>
              <div>
                <h1 className="main-title" style={{
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #fff, #e0e7ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                  lineHeight: '1.2'
                }}>
                  AI Flowchart Studio
                </h1>
                <p className="subtitle" style={{
                  color: '#e0f2fe',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '600',
                  flexWrap: 'wrap'
                }}>
                  <Rocket style={{ width: '1rem', height: '1rem', color: '#fde047' }} />
                  Transform Ideas into Visual Masterpieces
                  <Sparkles style={{ width: '1rem', height: '1rem', color: '#fbcfe8' }} />
                </p>
              </div>
            </div>
            <div style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #fbbf24, #f97316)',
              borderRadius: '1rem',
              color: 'white',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)',
              fontSize: '0.9rem'
            }}>
              <Star style={{ width: '1rem', height: '1rem' }} />
              Premium Quality
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        maxWidth: '1800px',
        margin: '0 auto',
        padding: '1.5rem',
        zIndex: 10
      }}>
        <div className="main-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 700px), 1fr))',
          gap: '1.5rem'
        }}>
          {/* Input Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Tips Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 30px rgba(6, 182, 212, 0.4)',
                  flexShrink: 0
                }}>
                  <Lightbulb style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 className="section-title" style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: 'white',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    Quick Start Guide
                    <ArrowRight style={{ width: '1.25rem', height: '1.25rem', color: '#fde047' }} />
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { num: '1', text: 'Indent your text using spaces or tabs', highlight: 'Indent' },
                      { num: '2', text: 'Each line = One Node in your chart', highlight: 'One Node' },
                      { num: '3', text: 'AI detects relationships automatically', highlight: 'AI detects' }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', color: '#e0f2fe' }}>
                        <div style={{
                          minWidth: '1.75rem',
                          height: '1.75rem',
                          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          color: 'white',
                          flexShrink: 0,
                          fontSize: '0.9rem'
                        }}>
                          {item.num}
                        </div>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.75rem' }}>
                          <strong style={{ color: '#fde047' }}>{item.highlight}</strong> {item.text.replace(item.highlight, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MASSIVE Input Box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              padding: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <h3 className="section-title" style={{
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}></div>
                  Your Text Input
                  <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: '#6ee7b7' }} />
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={clearAll}
                    style={{
                      padding: '0.65rem 1.25rem',
                      fontSize: '0.9rem',
                      color: 'white',
                      fontWeight: '700',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={loadExample}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: 'linear-gradient(135deg, #fbbf24, #f97316, #ef4444)',
                      color: 'white',
                      borderRadius: '1rem',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <Zap style={{ width: '1rem', height: '1rem' }} />
                    Load Example
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="✨ Paste your hierarchical text here...

Example:
Company Structure
    Engineering
        Frontend Team
        Backend Team
    Marketing
        Social Media
        Content Creation"
                style={{
                  width: '100%',
                  height: 'clamp(400px, 60vh, 850px)',
                  padding: '1.25rem',
                  border: '4px solid rgba(168, 85, 247, 0.5)',
                  borderRadius: '1.5rem',
                  resize: 'none',
                  fontFamily: 'monospace',
                  fontSize: 'clamp(0.9rem, 2vw, 1.125rem)',
                  lineHeight: '1.8',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#1f2937',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#06b6d4';
                  e.target.style.boxShadow = '0 0 0 8px rgba(6, 182, 212, 0.3), 0 10px 40px rgba(0, 0, 0, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                  e.target.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.2)';
                }}
              />

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleGenerate}
                  disabled={loading || !inputText.trim()}
                  className="btn-text"
                  style={{
                    flex: 1,
                    background: loading || !inputText.trim()
                      ? 'rgba(100, 100, 100, 0.5)'
                      : 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
                    color: 'white',
                    padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vw, 2.5rem)',
                    borderRadius: '1.5rem',
                    fontWeight: '900',
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    cursor: loading || !inputText.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 20px 60px rgba(6, 182, 212, 0.4)',
                    transition: 'all 0.3s',
                    opacity: loading || !inputText.trim() ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && inputText.trim()) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 25px 70px rgba(6, 182, 212, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 20px 60px rgba(6, 182, 212, 0.4)';
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: 'clamp(1.25rem, 3vw, 2rem)', height: 'clamp(1.25rem, 3vw, 2rem)', animation: 'spin 1s linear infinite' }} />
                      <span style={{ whiteSpace: 'nowrap' }}>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles style={{ width: 'clamp(1.25rem, 3vw, 2rem)', height: 'clamp(1.25rem, 3vw, 2rem)' }} />
                      <span style={{ whiteSpace: 'nowrap' }}>Generate Flowchart</span>
                      <Rocket style={{ width: 'clamp(1.25rem, 3vw, 2rem)', height: 'clamp(1.25rem, 3vw, 2rem)' }} />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  backdropFilter: 'blur(20px)',
                  border: '4px solid #f87171',
                  borderRadius: '1.5rem',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '1rem',
                  boxShadow: '0 10px 40px rgba(239, 68, 68, 0.3)'
                }}>
                  <AlertCircle style={{ width: '1.75rem', height: '1.75rem', color: '#fca5a5', flexShrink: 0, marginTop: '0.25rem' }} />
                  <p style={{ fontSize: '1.125rem', color: '#fef2f2', fontWeight: '700' }}>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stats Cards */}
            {result && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="stat-number" style={{
                  background: 'linear-gradient(135deg, #34d399, #10b981, #14b8a6)',
                  borderRadius: '1.5rem',
                  padding: 'clamp(1.25rem, 3vw, 2rem)',
                  color: 'white',
                  boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 25px 70px rgba(16, 185, 129, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(16, 185, 129, 0.4)';
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <CheckCircle2 style={{ width: 'clamp(1.25rem, 3vw, 2rem)', height: 'clamp(1.25rem, 3vw, 2rem)' }} />
                    <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.125rem)', fontWeight: '700' }}>Total Nodes</span>
                  </div>
                  <p style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: '900' }}>{result.nodes}</p>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star style={{ width: '1rem', height: '1rem', color: '#fde047' }} />
                    <span style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', opacity: 0.9 }}>Successfully Created</span>
                  </div>
                </div>
                <div className="stat-number" style={{
                  background: 'linear-gradient(135deg, #a78bfa, #c084fc, #f472b6)',
                  borderRadius: '1.5rem',
                  padding: 'clamp(1.25rem, 3vw, 2rem)',
                  color: 'white',
                  boxShadow: '0 20px 60px rgba(167, 139, 250, 0.4)',
                  transition: 'all 0.3s'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 25px 70px rgba(167, 139, 250, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(167, 139, 250, 0.4)';
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <TrendingUp style={{ width: 'clamp(1.25rem, 3vw, 2rem)', height: 'clamp(1.25rem, 3vw, 2rem)' }} />
                    <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.125rem)', fontWeight: '700' }}>Connections</span>
                  </div>
                  <p style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: '900' }}>{result.edges}</p>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap style={{ width: '1rem', height: '1rem', color: '#fde047' }} />
                    <span style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', opacity: 0.9 }}>Links Mapped</span>
                  </div>
                </div>
              </div>
            )}

            {/* Output Display */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  {result && (
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                      borderRadius: '50%',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}></div>
                  )}
                  <Sparkles style={{ width: '1.75rem', height: '1.75rem', color: '#fde047' }} />
                  Your Flowchart
                </h3>
                {result && (
                  <button
                    onClick={handleDownload}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1rem 1.5rem',
                      background: 'linear-gradient(135deg, #34d399, #10b981, #14b8a6)',
                      color: 'white',
                      borderRadius: '1rem',
                      fontWeight: '900',
                      fontSize: '1.125rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 25px 70px rgba(16, 185, 129, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 20px 60px rgba(16, 185, 129, 0.4)';
                    }}
                  >
                    <Download style={{ width: '1.5rem', height: '1.5rem' }} />
                    Download HD
                  </button>
                )}
              </div>

              <div style={{
                minHeight: 'clamp(400px, 60vh, 850px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '1.5rem',
                border: '4px dashed rgba(255, 255, 255, 0.3)',
                background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(91, 33, 182, 0.3))',
                backdropFilter: 'blur(10px)',
                overflow: 'auto'
              }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        opacity: 0.5,
                        animation: 'pulse 3s ease-in-out infinite'
                      }}></div>
                      <Loader2 style={{
                        width: '8rem',
                        height: '8rem',
                        color: '#a5f3fc',
                        position: 'relative',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <Brain style={{
                        width: '3.5rem',
                        height: '3.5rem',
                        color: '#c4b5fd',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} />
                    </div>
                    <p style={{
                      color: 'white',
                      fontWeight: '900',
                      fontSize: '2rem',
                      marginBottom: '0.75rem'
                    }}>
                      AI is Working Its Magic
                    </p>
                    <p style={{
                      color: '#a5f3fc',
                      fontSize: '1.25rem',
                      marginBottom: '1.5rem'
                    }}>
                      Analyzing hierarchy and crafting your flowchart...
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        background: '#06b6d4',
                        borderRadius: '50%',
                        boxShadow: '0 0 20px #06b6d4',
                        animation: 'bounce 1s ease-in-out infinite'
                      }}></div>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        background: '#a78bfa',
                        borderRadius: '50%',
                        boxShadow: '0 0 20px #a78bfa',
                        animation: 'bounce 1s ease-in-out infinite 0.1s'
                      }}></div>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        background: '#f472b6',
                        borderRadius: '50%',
                        boxShadow: '0 0 20px #f472b6',
                        animation: 'bounce 1s ease-in-out infinite 0.2s'
                      }}></div>
                    </div>
                  </div>
                ) : result ? (
                  <div style={{ width: '100%', height: '100%', padding: '1.5rem' }}>
                    <div style={{
                      background: 'white',
                      borderRadius: '1.5rem',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                      padding: '2rem',
                      border: '4px solid #a78bfa',
                      height: '100%',
                      overflow: 'auto',
                      transition: 'all 0.3s'
                    }}>
                      <img
                        src={result.imageUrl}
                        alt="Generated Flowchart"
                        onClick={() => window.open(result.imageUrl, '_blank')}
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '1rem',
                          cursor: 'pointer',
                          maxWidth: 'none',
                          imageRendering: 'crisp-edges',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.02)';
                          e.target.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = 'none';
                        }}
                        onError={() => setError("Failed to load generated image")}
                      />
                    </div>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                      <p style={{
                        fontSize: '1.25rem',
                        color: '#a5f3fc',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem'
                      }}>
                        <Star style={{ width: '1.5rem', height: '1.5rem', color: '#fde047', animation: 'pulse 2s ease-in-out infinite' }} />
                        High-Resolution Flowchart Ready!
                        <span style={{ color: '#c4b5fd' }}>Click to zoom</span>
                        <Star style={{ width: '1.5rem', height: '1.5rem', color: '#fde047', animation: 'pulse 2s ease-in-out infinite' }} />
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #06b6d4, #a78bfa)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                        opacity: 0.3,
                        animation: 'pulse 3s ease-in-out infinite'
                      }}></div>
                      <FileText style={{
                        width: '8rem',
                        height: '8rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        position: 'relative'
                      }} />
                      <Sparkles style={{
                        width: '3rem',
                        height: '3rem',
                        color: '#fde047',
                        position: 'absolute',
                        top: '-1rem',
                        right: '-1rem',
                        animation: 'bounce 2s ease-in-out infinite'
                      }} />
                    </div>
                    <p style={{
                      color: 'white',
                      fontWeight: '900',
                      fontSize: '2rem',
                      marginBottom: '1rem'
                    }}>
                      Your Masterpiece Appears Here
                    </p>
                    <p style={{
                      color: '#a5f3fc',
                      fontSize: '1.25rem'
                    }}>
                      Enter your text and click Generate to begin
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Features Showcase */}
            <div style={{
              background: 'linear-gradient(135deg, #fbbf24, #f97316, #ef4444)',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 60px rgba(251, 191, 36, 0.4)',
              padding: '2rem',
              color: 'white'
            }}>
              <h4 style={{
                fontWeight: '900',
                fontSize: '2rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Rocket style={{ width: '2rem', height: '2rem' }} />
                Premium Features
                <Sparkles style={{ width: '2rem', height: '2rem', animation: 'pulse 2s ease-in-out infinite' }} />
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                {[
                  { emoji: '🧠', title: 'AI-Powered Intelligence', desc: 'Advanced AI analyzes your structure' },
                  { emoji: '⚡', title: 'Lightning Fast', desc: 'Professional charts generated in seconds' },
                  { emoji: '🎨', title: 'Ultra HD Quality', desc: '3000x2400 resolution for perfect prints' }
                ].map((feature, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '1rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s'
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.transform = 'translateX(10px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}>
                    <div style={{ fontSize: '2.5rem' }}>{feature.emoji}</div>
                    <div>
                      <p style={{ fontWeight: '900', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.title}</p>
                      <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)' }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'relative',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        zIndex: 10
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap'
          }}>
            <Brain style={{ width: '1.5rem', height: '1.5rem', color: '#a5f3fc' }} />
            Powered by <span style={{
              background: 'linear-gradient(135deg, #a5f3fc, #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '900',
              fontSize: '1.5rem'
            }}>Anandini Gollamudi</span>
            <span style={{ color: '#fde047' }}>•</span>
            Built with <span style={{ color: '#f87171', fontSize: '1.5rem', animation: 'pulse 2s ease-in-out infinite' }}>♥</span> for creative minds
            <Sparkles style={{ width: '1.5rem', height: '1.5rem', color: '#fde047', animation: 'pulse 2s ease-in-out infinite' }} />
          </p>
        </div>
      </div>
    </div>
  );
}