import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height:"100vh", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          fontFamily:"'DM Sans',sans-serif", color:"#333",
          padding:20, textAlign:"center",
        }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
          <h2 style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Something went wrong</h2>
          <p style={{ fontSize:13, color:"#666", marginBottom:16, maxWidth:320 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); }}
            style={{
              padding:"12px 24px", background:"#2E3650", color:"#fff",
              border:"none", borderRadius:12, fontSize:14, fontWeight:600,
              cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
